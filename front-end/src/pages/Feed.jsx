import { useEffect, useState } from "react"

import Loading from "../components/Loading.jsx"
import StoriesBar from "../components/StoriesBar.jsx"
import PostCard from "../components/postCard.jsx"
import RecentMessage from "../components/RecentMessage.jsx"
import { useAuth } from "@clerk/clerk-react"
import api from "../api/axios.js"
import toast from "react-hot-toast"
import Sponsore from "../components/sponsore.jsx"
import { fetchRecentMessages } from "../redux/messages/recentMessages.js"
import CreatePosts from "./CreatePost.jsx"
import SetPost from "../components/setPost.jsx"
function Feed(){
    const [feeds,setFeeds]=useState([])
    const [loading,setLoading]=useState(true)
    const {getToken}=useAuth()
    const fetchFeed= async()=>{
        setLoading(true)
        try {
            const {data}=await api.get("/api/post/getPosts",{
                headers:{Authorization:`Bearer ${await getToken()}`}
            })
            if(data.success){
                setFeeds(data.posts)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
        setLoading(false)
    }
    useEffect(()=>{
        fetchFeed()
    },[])
    return !loading?(
        <div className="min-h-screen overflow-y-auto bg-gray-100 gap-2 md:ps-8 flex items-start pt-4 justify-center xl:gap-8 xl:pr-5">
            <div className="hidden md:block w-60 bg-white">
                <div className="fixed w-60 top-15 left-5">
                    <Sponsore />
                   <RecentMessage />
                </div>
            </div>
            <div className="pt-10">
                <SetPost />
                <StoriesBar />
                <div className="space-y-6 pt-6">
                {
                    feeds.map((post)=>(
                        <PostCard key={post._id} post={post}/>
                    ))
                }
                </div>
            </div>
            
        </div>
    ):<Loading />
}
export default Feed