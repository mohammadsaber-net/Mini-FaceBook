import { useEffect, useState } from "react"
import { assets, dummyPostsData } from "../assets/assets.js"
import Loading from "../components/Loading.jsx"
import StoriesBar from "../components/StoriesBar.jsx"
import PostCard from "../components/postCard.jsx"
import RecentMessage from "../components/RecentMessage.jsx"
import { useAuth } from "@clerk/clerk-react"
import api from "../api/axios.js"
import toast from "react-hot-toast"

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
                console.log(data.posts)
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
        <div className="min-h-screen overflow-y-auto bg-gray-100 gap-2 ps-8 flex items-start pt-4 justify-center xl:gap-8 xl:pr-5">
            <div>
                <StoriesBar />
                <div className="space-y-6 py-4 md:pt-8">
                {
                    feeds.map((post)=>(
                        <PostCard key={post._id} post={post}/>
                    ))
                }
                </div>
            </div>
            <div className="sticky top-0 bg-white">
                <div className="max-w-xs text-xs p-4 rounded-md inline-flex flex-col gap-2 shadow">
                    <h1 className="text-shadow-teal-800 font-semibold">sponsored</h1>
                    <img src={assets.sponsored_img} className="w-75
                     h-50 rounded-md" alt="" />
                    <p className="text-slate-600">Email marketing</p>
                    <p className="text-slate-400">upcharge your marketing with a powerful , easy to use platform built for results.</p>

                </div>
                <RecentMessage />
            </div>
        </div>
    ):<Loading />
}
export default Feed