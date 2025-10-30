import express from 'express'
import cors from "cors"
import "dotenv/config"
import connectDb from './configs/db.js'
import { inngest,functions } from './inngest/index.js'
import {serve} from "inngest/express"
import { clerkMiddleware } from '@clerk/express'
import userRouter from './routes/userRoutes.js'
import connectionRouter from './routes/connectionRoutes.js'
import postRouter from './routes/postRoutes.js'
import storyRouter from './routes/storyRoutes.js'
import messageRouter from './routes/messagesRoute.js'
import { Post } from './model/posts.js'
import commentRouter from './routes/commentsRoutes.js'

const app=express()
await connectDb()
app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())
// await Post.deleteMany() // to clear posts collection on server restart
app.get("/",(req,res)=>res.send("server is running"))
app.use("/api/inngest",serve({client:inngest,functions}))
app.use("/api/user",userRouter)
app.use("/api/connection",connectionRouter)
app.use("/api/post",postRouter)
app.use("/api/story",storyRouter)
app.use("/api/message",messageRouter)
app.use("/api/comment",commentRouter)
app.listen(process.env.PORT,()=>{
    console.log(`listening at port http://localhost:${process.env.PORT}`)
})