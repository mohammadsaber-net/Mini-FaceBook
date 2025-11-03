import { imagekit } from "../configs/imagekit.js"
import fs from "fs"
import { inngest } from "../inngest/index.js"
import { Message } from "../model/messages.js"
import { catchErrorMidelware, handleError } from "../middleware/authentication.js"
import { FaceUser } from "../model/FaceUser.js"

const connections={}
export const sseController=catchErrorMidelware((req,res,next)=>{
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
})
export const sendMessage=catchErrorMidelware(async(req,res,next)=>{
        const {userId}=req.auth()
        const {to_user_id,text}=req.body
        let media_url=""
        const user=await FaceUser.findById(userId)
        if(user.blocked.includes(to_user_id)){
            return handleError("you can't message this user, you have blocked him",200,next)
        }
        if(!user.connections.includes(to_user_id)){
            return handleError("you are no longer friends",200,next)
        }
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
        await inngest.send({
        name: "app/message.sent",
        data: { messageId: message._id }
        });

        res.json({
            success:true,
            message
        })
        const MessagewithUserData=await Message.findById(message._id).populate("from_user_id")
        if(connections[to_user_id]){
            connections[to_user_id].write(`data: ${JSON.stringify({ message: "connected" })}\n\n`)
        }
        
})
export const getChatMessages=catchErrorMidelware(async(req,res,next)=>{
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
} )
// export const getUserRecentMessages = catchErrorMidelware(async (req, res, next) => {
//   const { userId } = req.auth();

//   const messages = await Message.find({
//     $or: [
//       { from_user_id: userId },
//       { to_user_id: userId }
//     ]
//   }).sort({ createdAt: -1 });

//   const formattedMessages = messages.map(msg => ({
//     ...msg.toObject(),
//     isIncoming: msg.to_user_id === userId,
//     isOutgoing: msg.from_user_id === userId,
//   }));

//   res.status(200).json({ success: true, messages: formattedMessages });
// });


export const getUserRecentMessages = catchErrorMidelware(async (req, res, next) => {
  const { userId } = req.auth();
  const messages = await Message.find({
    $or: [
      { to_user_id: userId },
      { from_user_id: userId},
    ]
  }).populate("from_user_id to_user_id").sort({ createdAt: -1 });
  res.status(200).json({ success: true, messages });
});

