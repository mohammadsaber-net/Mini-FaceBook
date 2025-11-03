// import {asyncWrapProvider} from "async_hooks"
import {imagekit} from "../configs/imagekit.js"
import fs from "fs"
import { FaceUser } from "../model/FaceUser.js"
import { Post } from "../model/posts.js"
import { Connection } from "../model/Connections.js"
import { catchErrorMidelware, handleError } from "../middleware/authentication.js"
export const getUserData=catchErrorMidelware( async(req,res,next)=>{
        const {userId}=req.auth()
        const value=await FaceUser.findById(userId).populate("blocked")
        return res.status(200).json({
                success:true,
                value
        })
})
//update data 
export const updateUserData=catchErrorMidelware(async(req,res,next)=>{
        const {userId}=req.auth()
        let {username,bio,location,full_name}=req.body
        const tempUser=await FaceUser.findById(userId)
        username = username || tempUser.username
        bio = bio || tempUser.bio
        location = location || tempUser.location
        full_name = full_name || tempUser.full_name
        if(username !== tempUser.username){
            const value=await FaceUser.findOne({username})
            if(value){
                return handleError("Username already taken",400,next)
            }
        }
        const updatedData={username,bio,location,full_name}
        const profile=req.files.profile && req.files.profile[0]
        const cover=req.files.cover && req.files.cover[0]
        if(profile){
            const buffer=fs.readFileSync(profile.path)
            const response=await imagekit.upload({
                file:buffer,
                fileName:profile.originalname,
            })
            const url=imagekit.url({
                path:response.filePath,
                transformation:[
                    {quality:"auto"},
                    {format:"webp"},
                    {width:"512"},
                ]
            })
            updatedData.profile_picture=url
        }
        if(cover){
            const buffer=fs.readFileSync(cover.path)
            const response=await imagekit.upload({
                file:buffer,
                fileName:cover.originalname,
            })
            const url=imagekit.url({
                path:response.filePath,
                transformation:[
                    {quality:"auto"},
                    {format:"webp"},
                    {width:"1280"},
                ]
            })
            updatedData.cover_photo=url
        }
        const updating=await FaceUser.findByIdAndUpdate(userId,updatedData,{new:true})
        return res.status(200).json({
            success:true,
            value:updating,
            message:"profile updated successfully"
        })
})
export const discoverUsers=catchErrorMidelware(async(req,res,next)=>{
        const {userId}=req.auth()
        const {input}=req.body
        const allUsers=await FaceUser.find({
        $or:[
            {username:new RegExp(input,"i")},
            {email:new RegExp(input,"i")},
            {full_name:new RegExp(input,"i")},
            {location:new RegExp(input,"i")},
        ]
    })
    const filterAllUsers=allUsers.filter(user=>user._id !== userId)
    if(filterAllUsers.length===0){
        return handleError("there are no user with that name",200,next)
    }
    return res.status(200).json({
        success:true,
        users:filterAllUsers
    })
})
export const followUser=catchErrorMidelware(async(req,res,next)=>{
    const {userId}=req.auth()
    const {id}=req.body
    const user=await FaceUser.findById(userId)
    const toUser=await FaceUser.findById(id)
     if(!user || !toUser){
        return handleError("user not found",404,next)
    }
    if(user.following.includes(id)){
        return handleError("you are already following "+toUser.username,404,next)
    }
    user.following.push(id)
    toUser.followers.push(userId)
    await user.save()
    await toUser.save()
    res.status(200).json({
        success:true,
        message:"now you are following "+ toUser.username,
    })
})
export const unFollowUser=catchErrorMidelware(async(req,res,next)=>{
    const {userId}=req.auth()
    const {id}=req.body
    const user=await FaceUser.findById(userId)
    const toUser=await FaceUser.findById(id)
    if(!user || !toUser){
        return handleError("user not found",404,next)
    }
    if(!user.following.includes(id)){
        return handleError("you are already unfollowing "+toUser.username,404,next)
    }
    user.following=user.following.filter(user=>user !==id)
    toUser.followers=toUser.followers.filter(user=>user !==userId)
    await user.save()
    await toUser.save()
    res.status(200).json({
        success:true,
        message:"now you are unfollowing "+ toUser.username,
    })
})
export const getUserProfile=catchErrorMidelware(async(req,res,next)=>{
        const {userId}=req.auth()
        const {id}=req.body
        const profile=await FaceUser.findById(id).populate("followers following connections")
        const posts=await Post.find({user:id}).populate("user").sort({createdAt:-1})
        res.status(200).json({
            success:true,
            profile,
            posts
        })
})
export const blocked=catchErrorMidelware(async(req,res,next)=>{
        const {userId}=req.auth()
        const {blockedId}=req.body
        if(userId===blockedId){
            return handleError("not available",200,next)
        }
        const user=await FaceUser.findById(userId)
        if(user.blocked.includes(blockedId)){
            user.blocked=user.blocked.filter(id=>id !== blockedId)
            await user.save()
            res.status(200).json({
                success:true,
                message:"user unblocked successfully",
                block:user.blocked
            })
        }else{
           user.blocked.push(blockedId)
           const blockedUser=await FaceUser.findById(blockedId)
            await Connection.updateMany(
            {
                $or: [
                { from_user_id: userId, to_user_id: blockedId },
                { from_user_id: blockedId, to_user_id: userId }
                ],
                status: "accepted"
            },
            { $set: { status: "pending" } }
            );

           user.connections=user.connections.filter(id=>id !==blockedId)
           user.following=user.following.filter(id=>id !==blockedId)
           user.followers=user.followers.filter(id=>id !==blockedId)
           blockedUser.connections=blockedUser.connections.filter(id=>id !==userId)
           blockedUser.following=blockedUser.following.filter(id=>id !==userId)
           blockedUser.followers=blockedUser.followers.filter(id=>id !==userId)
           const userPosts=await Post.find({user:userId})
           const blockedUserPosts=await Post.find({user:blockedId})
           userPosts.forEach(async(post)=>{
                post.likes_count=post.likes_count.filter(id=>id !== blockedId)
                await post.save()
           })
           blockedUserPosts.forEach(async(post)=>{
                post.likes_count=post.likes_count.filter(id=>id !== userId)
                await post.save()
           })
           await user.save()
           await blockedUser.save()
            res.status(200).json({
                success:true,
                message:"user blocked successfully",
                block:user.blocked
            })
        }
})