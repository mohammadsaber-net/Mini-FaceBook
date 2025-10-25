import express from "express"
import { protect } from "../middleware/authentication.js"
import { addUserStory, getStory } from "../controller/storyController.js"
import { upload } from "../configs/multer.js"
const storyRouter=express.Router()
storyRouter.post("/create",upload.single("media"),protect,addUserStory)
storyRouter.get("/get",protect,getStory)
export default storyRouter