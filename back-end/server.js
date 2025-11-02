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
import commentRouter from './routes/commentsRoutes.js'

const app=express()
await connectDb()
app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())
app.get("/",(req,res)=>res.send("server is running"))
app.use("/api/inngest",serve({client:inngest,functions}))
app.use("/api/user",userRouter)
app.use("/api/connection",connectionRouter)
app.use("/api/post",postRouter)
app.use("/api/story",storyRouter)
app.use("/api/message",messageRouter)
app.use("/api/comment",commentRouter)
app.use((req,res,next)=>{
    res.status(404).json("this page is not available")
    return next()
})
app.use((error,req,res,next)=>{
  res.status(error.status || 500).json({
      success:error.httpError,
      message:error.message,
      data:null
  })
})
app.listen(process.env.PORT,()=>{
    console.log(`listening at port http://localhost:${process.env.PORT}`)
})