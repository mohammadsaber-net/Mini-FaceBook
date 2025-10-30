import express from "express"
import { protect } from "../middleware/authentication.js"
import { upload } from "../configs/multer.js"
import { addComment, likeComment} from "../controller/commentController.js"
const commentRouter=express.Router()
commentRouter.post("/add",protect,upload.array("image",4),addComment)
commentRouter.post("/like",protect,likeComment)
export default commentRouter