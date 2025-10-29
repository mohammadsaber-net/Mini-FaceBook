import { imagekit } from "../configs/imagekit.js"
import fs from "fs"
import { Message } from "../model/messages.js"

const connections={}
export const sseController=(req,res)=>{
    try {
        const {userId}=req.params
        res.setHeader("Content-Type","text/event-stream")
        res.setHeader("Cache-Control","no-cache")
        res.setHeader("Connection","keep-alive")
        res.setHeader("Access-Control-Allow-Origin","*")
        connections[userId]=res
        res.write("log:Connected to SSE stream \n\n")
        res.on("close",()=>{
            delete connections[userId]
        })

    } catch (error) {
        return res.status(500).json({
                success:false,
                message:error.message
            })
    }
}
export const sendMessage=async(req,res)=>{
    try {
        const {userId}=req.auth()
        const {to_user_id,text}=req.body
        let media_url=""
        const image =req.file
        const message_type=image?"image":"text"
        if(message_type==="image"){
            const buffer = await fs.promises.readFile(image.path)
            const response = await imagekit.upload({
                file: buffer,
                fileName: image.originalname
            })
            const url=imagekit.url({
                path:response.filePath,
                transformation:[
                    {quality:"auto"},
                    {format:"webp"},
                    {width:"1280"},
                ]
            })
            media_url=url
        }
        const message=await Message.create({
            from_user_id:userId,
            to_user_id,
            text,
            message_type,
            media_url,

        })
        res.json({
            success:true,
            message
        })
        const MessagewithUserData=await Message.findById(message._id).populate("from_user_id")
        if(connections[to_user_id]){
            connections[to_user_id].write(`data: ${JSON.stringify({ message: "connected" })}\n\n`)
        }
    } catch (error) {
        return res.status(500).json({
                success:false,
                message:error.message
            })
    }
}
export const getChatMessages=async(req,res)=>{
    try {
        const {userId}=req.auth()
        const {messageId}=req.body
        const message=await Message.find(
        {$or:[
            {to_user_id:userId,from_user_id:messageId},
            {to_user_id:messageId,from_user_id:userId}
        ]}
        ).sort({createdAt:-1})
        await Message.updateMany({from_user_id:messageId,to_user_id:userId}
            ,{seen:true}
        )
        res.json({success:true,message})
    } catch (error) {
        return res.status(500).json({
                success:false,
                message:error.message
            })
    }
} 
export const getUserRecentMessages=async(req,res)=>{
    try {
        const {userId}=req.auth()
        const messages=await Message.find({
            to_user_id: userId,
            seen:false
        // $or: [
        //     { from_user_id: userId },
        //     { to_user_id: userId }
        // ]
        }).populate("to_user_id from_user_id").sort({createdAt:-1})
        res.status(200).json({success:true,messages})
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
} 
