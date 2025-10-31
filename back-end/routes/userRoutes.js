import express from "express"
import { protect } from "../middleware/authentication.js"
import { blocked, discoverUsers, followUser, getUserData, getUserProfile, unFollowUser, updateUserData } from "../controller/userController.js"
import { upload } from "../configs/multer.js"
// import { getUserRecentMessages } from "../controller/messageController.js"
const userRouter=express.Router()
userRouter.get("/data",protect,getUserData)
userRouter.patch("/update",upload.fields([{name:"profile",maxCount:1},{name:"cover",maxCount:1}]),protect,updateUserData)
userRouter.post("/discover",protect,discoverUsers)
userRouter.post("/follow",protect,followUser)
userRouter.post("/unFollow",protect,unFollowUser)
userRouter.post("/block",protect,blocked)
userRouter.post("/profiles",protect,getUserProfile)
export default userRouter