import { imagekit } from "../configs/imagekit.js"
import { catchErrorMidelware, handleError } from "../middleware/authentication.js"
import { Comment } from "../model/comments.js"
import { Post } from "../model/posts.js"
import fs from "fs"
export const addComment =catchErrorMidelware( 
    async (req, res,next) => {
        const { userId } = req.auth()
        const { postId, content, type_comment } = req.body
        let image_url = []
        const images=req.files || []
        if (type_comment === "image" || type_comment === "image_with_text") {
            if (images.length > 0) {
                await Promise.all(
                    images.map(async (image) => {
                        const buffer = await fs.promises.readFile(image.path)
                        const response = await imagekit.upload({
                            file: buffer,
                            fileName: image.originalname,
                            folder: "comments"
                        })
                        const url = imagekit.url({
                            path: response.filePath,
                            transformation: [
                                { quality: "auto" },
                                { format: "webp" },
                                { width: "1280" },
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
        }
        const post = await Post.findById(postId)
        if (!post) {
            return handleError("post not available",404,next)
        }

        const newComment = await Comment.create({
        post: postId,
        user: userId,
        content,
        type_comment,
        image_url
        });
        const commentPopulated = await Comment.findById(newComment._id).populate('user', 'full_name username profile_picture');
        post.comment.push(commentPopulated._id);
        await post.save();

        return res.status(201).json({
        success: true,
        message: "Comment added successfully",
        comment: commentPopulated,
        });
})
export const likeComment=catchErrorMidelware( async(req,res,next)=>{
        const {userId}=req.auth()
        const {commentId}=req.body
        const comment=await Comment.findById(commentId)
        if (!comment) {
            return handleError("comment not available",404,next)
        }
        if(comment.likes_count.includes(userId)){
            comment.likes_count=comment.likes_count.filter(user=>user !== userId)
            await comment.save()
            const updatedComment = await Comment.findById(commentId).populate('user', 'full_name profile_picture');
            return res.status(201).json({success:true,comment:updatedComment,message:"comment unliked"})
        }else{
            comment.likes_count.push(userId)
            await comment.save()
            const updatedComment = await Comment.findById(commentId).populate('user', 'full_name profile_picture');
            return res.status(201).json({success:true,comment:updatedComment,message:"comment liked"})
        }
})