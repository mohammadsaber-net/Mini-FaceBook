import { err } from "inngest/types"
import { inngest } from "../inngest/index.js"
import { Connection } from "../model/Connections.js"
import { FaceUser } from "../model/FaceUser.js"
import { catchErrorMidelware, handleError } from "../middleware/authentication.js"

export const sendConnectionRequest=catchErrorMidelware(
     async(req,res,next)=>{
        const {userId}=req.auth()
        const {id}=req.body
        const last24H=new Date(Date.now() - 24*60*60*1000)
        const connectionRequests=await Connection.find({
            from_user_id:userId,
            createdAt:{$gt:last24H}
        })
        if(connectionRequests.length>=20){
            return handleError("you have sent 20 request in last 24 h, you can back tomorrow for more requests",403,next)
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
            return handleError("you are aleardy friends",200,next)
        }
        return handleError("connection request pending",200,next)
})
export const getUserConnections=catchErrorMidelware(
async(req,res,next)=>{
       const {userId}=req.auth()
       const user =await FaceUser.findById(userId).populate("connections followers following")
       if (!user) {
        return handleError("User not found",404,next)
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
})
export const acceptConnectionRequest=catchErrorMidelware(
    async(req,res,next)=>{
        const {userId}=req.auth()
       const {id}=req.body
       const connection =await Connection.findOne({from_user_id:id,to_user_id:userId})
       if(!connection){
           return handleError("conncetion not found",404,next)
        }
        const user=await FaceUser.findById(userId)
        const toUser=await FaceUser.findById(id)
        if(!toUser || !user){
           return handleError("user not found",404,next)
        }
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
})