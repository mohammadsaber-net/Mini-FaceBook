import fs from "fs"
import { imagekit } from "../configs/imagekit.js"
import { Story } from "../model/story.js"
import { inngest } from "../inngest/index.js"
import { FaceUser } from "../model/FaceUser.js"
import { catchErrorMidelware, handleError } from "../middleware/authentication.js"
export const addUserStory=catchErrorMidelware( async(req,res,next)=>{
        const {userId}=req.auth()
        const {content,media_type,background_color,media}=req.body
        let media_url=""
        if(media_type==="video" || media_type === "image"){
            const buffer=await fs.promises.readFile(req.file.path)
            const response=await imagekit.upload({
                file:buffer,
                fileName:req.file.originalname,
            })
            media_url=response.url
        }
        
            const story=await Story.create({
                user:userId,
                content,
                media_url,
                media_type,
                media,
                background_color
            })
            await inngest.send({
                name:"app/story.delete",
                data:{storyId:story._id}
            })
        res.status(201).json({
            success:true
        })
})
export const getStory=catchErrorMidelware(async(req,res,next)=>{
        const {userId}=req.auth()
        const user=await FaceUser.findById(userId)
        if (!user) {
            return handleError("user not found",404,next)
        }
        const userIds = [userId, ...user.connections, ...user.following].flat();
        const stories=await Story.find({user:{$in:userIds}}).populate("user").sort({createdAt:-1})
        res.status(200).json({
            success:true,
            stories
        })
})