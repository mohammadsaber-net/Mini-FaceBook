import express from "express"
import { protect } from "../middleware/authentication.js"
import { upload } from "../configs/multer.js"
import { addPost, getOnePost, getPosts, likePost } from "../controller/postControler.js"
const postRouter=express.Router()
postRouter.post("/add",protect,upload.array("image",4),addPost)
postRouter.get("/getPosts",protect,getPosts)
postRouter.post("/like",protect,likePost)
postRouter.post("/getPost/:postId",protect,getOnePost)
export default postRouter