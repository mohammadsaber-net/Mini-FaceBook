import { Menu, X } from "lucide-react"
import Loading from "../components/Loading"
import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import SideBar from "../components/sideBar.jsx"
import { useDispatch, useSelector } from "react-redux"
import { fetchRecentMessages } from "../redux/messages/recentMessages.js"
import { useAuth } from "@clerk/clerk-react"
import Navbar from "../components/navbar.jsx"
import StoryModel from "../components/StoryModel.jsx"
import CreatePosts from "./CreatePost.jsx"

function LayOut(){
    const user=useSelector(state=>state.user?.user)
    const navigate=useNavigate()
    const showModel=useSelector((state)=>state.showModels.story)
    const showPost=useSelector((state)=>state.showModels.post)
    const [unread,setUnRead]=useState(false)
    const [sideOpen,setSideOpen]=useState()
    const dispatch=useDispatch()
    const {getToken}=useAuth()
    const {messages}=useSelector(state=>state.recentMessage)
    const fetchMessage=async()=>{
        const token =await getToken()
        dispatch(fetchRecentMessages(token))
    }
    useEffect(()=>{
        if(user){
            fetchMessage()
            }
        },[user])
        useEffect(()=>{
            if(Array.isArray(messages)&&messages.length>0){
                setUnRead(true)
            }
        },[messages])
    return user?(
        <div className="flex relative ">
            <Navbar />
            {showModel&& <StoryModel/>}
            {showPost&& <CreatePosts/>}
            {/* <SideBar sideOpen={sideOpen} setSideOpen={setSideOpen} /> */}
            <div className="bg-gray-100 mt-8 w-screen">
                <Outlet />
            </div>
            <div className={`hidden absolute top-3 z-50 ${sideOpen?"text-white left-36":"text-white  left-3"} transition-all duration-300`}>
            {sideOpen?<X onClick={()=>setSideOpen(false)}/>:<Menu  onClick={()=>setSideOpen(true)}/>}
            </div>
        </div>
    ):(
        <Loading />
    )
}
export default LayOut