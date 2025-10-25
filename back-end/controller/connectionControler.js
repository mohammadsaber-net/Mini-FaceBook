import { err } from "inngest/types"
import { inngest } from "../inngest/index.js"
import { Connection } from "../model/Connections.js"
import { FaceUser } from "../model/FaceUser.js"

export const sendConnectionRequest=async(req,res)=>{
    try {
        const {userId}=req.auth()
        const {id}=req.body
        const last24H=new Date(Date.now() - 24*60*60*1000)
        const connectionRequests=await Connection.find({
            from_user_id:userId,
            createdAt:{$gt:last24H}
        })
        if(connectionRequests.length>=20){
            return res.status(403).json({
                success:false,
                message:"you have sent 20 request in last 24 h, you can back tomorrow for more requests"
            })
        }
        const connection=await Connection.findOne({
                $or:[
                    {from_user_id:userId,to_user_id:id},
                    {from_user_id:id,to_user_id:userId}
                ]
            })
        if(!connection){
            const newConnection=await Connection.create({
                from_user_id:userId,
                to_user_id:id
            })
            await inngest.send({
                name:"app/connection-request",
                data:{connectionId:newConnection._id}
            })
            return res.status(200).json({success:true,message:"connection request sent successfully"})
        }else if(connection && connection.status==="accepted"){
            return res.status(200).json({success:false,message:"you are aleardy friends"})
        }
        return res.status(200).json({success:false,message:"connection request pending"})
    } catch (error) {
        return res.status(500).json({
                success:false,
                message:error.message
            })
    }
}
export const getUserConnections=async(req,res)=>{
    try {
       const {userId}=req.auth()
       const user =await FaceUser.findById(userId).populate("connections followers following")
       if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
        }
       const connections=user.connections 
       const followers=user.followers 
       const following=user.following 
       const pendingConnectionsDocs = await Connection.find({
        to_user_id: userId,
        status: "pending"
        }).populate("from_user_id");

        const pendingConnections = pendingConnectionsDocs.map(
        (connection) => connection.from_user_id
        );

       res.status(200).json({
        success:true,
        connections,
        followers,
        following,
        pendingConnections
       })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
export const acceptConnectionRequest=async(req,res)=>{
    try {
        const {userId}=req.auth()
       const {id}=req.body
       const connection =await Connection.findOne({from_user_id:id,to_user_id:userId})
       if(!connection){
           return res.status(404).json({
               success:false,
               message:"connection not found"
            })
        }
        const user=await FaceUser.findById(userId)
        const toUser=await FaceUser.findById(id)
        user.connections.push(id)
        toUser.connections.push(userId)
        await user.save()
        await toUser.save()
        connection.status="accepted"
        await connection.save()
        return res.status(200).json({
            success:true,
            message:"connection has accepted successfully"
        })
    } catch (error) {
        console.log("connectino errrr",error)
        return res.status(500).json({
                success:false,
                message:error.message
            })
    }
}