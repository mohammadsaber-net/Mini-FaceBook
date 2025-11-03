import fs from "fs"
import {imagekit} from "../configs/imagekit.js"
import { Post } from "../model/posts.js"
import { FaceUser } from "../model/FaceUser.js"
import { catchErrorMidelware, handleError } from "../middleware/authentication.js"


export const addPost=catchErrorMidelware(async (req,res,next)=>{
        const {userId}=req.auth()
        const {content,post_type}=req.body
        const images=req.files || []
        let image_url=[]
        if(images && images.length > 0){
                await Promise.all(
                images.map(async(image)=>{
                    const buffer =await fs.promises.readFile(image.path)
                    const response=await imagekit.upload({
                        file:buffer,
                        fileName:image.originalname,
                        folder:"posts"
                    })
                    const url =imagekit.url({
                        path:response.filePath,
                        transformation:[
                            {quality:"auto"},
                            {format:"webp"},
                            {width:"1280"},
                        ]
                    })
                    try {
                        await fs.promises.unlink(image.path)
                    } catch (err) {
                        console.error("Failed to delete temp file:", err)
                    }
                    image_url.push(url)
                })
            )
        }
        await Post.create({
            user:userId,
            content,
            image_url,
            post_type
        })
        res.status(201).json({
            success:true,
            message:"post created successfully"
        })
})
export const getPosts=catchErrorMidelware(async(req,res,next)=>{
        const {userId}=req.auth()
        const user =await FaceUser.findById(userId)
        if (!user) {
        return handleError("user not found",404,next)
        }
        const userIds=[userId,...user.connections,...user.following]
        const posts=await Post.find({user:{$in:userIds}}).populate("user comment").sort({createdAt:-1})
        return res.status(201).json({
            success:true,
            posts
        })
})


export const likePost=catchErrorMidelware(async(req,res,next)=>{
        const {userId}=req.auth()
        const {postId}=req.body
        const post=await Post.findById(postId)
        console.log(post);
        if(!post){
           return handleError("post not found",404,next)
        }
        if(post.likes_count.includes(userId)){
            post.likes_count=post.likes_count.filter(user=>user !== userId)
            console.log("unliked",post.likes_count);
            await post.save()
            return res.status(201).json({success:true,message:"post unliked"})
        }else{
            post.likes_count.push(userId)
            console.log("liked",post.likes_count);
            await post.save()
            return res.status(201).json({success:true,message:"post liked"})
        }
        
})
export const getOnePost=catchErrorMidelware(async(req,res,next)=>{
        const {userId}=req.auth()
        const {postId}=req.params
        const post=await Post.findById(postId).populate("user").populate({
            path:"comment",
            populate:{
                path: "user",
                select: "username profile_picture" 
            }
        })
        if (!post) {
            return handleError("post not found",404,next)
        }
        return res.status(200).json({
            success: true,
            post
        })
})