import { useEffect, useState } from "react"
import { BadgeCheck, Heart, MessageCircle, Share2 } from "lucide-react"
import moment from "moment"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import api from "../api/axios.js";
import { useAuth } from "@clerk/clerk-react"
import toast from "react-hot-toast"
import ResponsiveImage from "./responsiveImage.jsx"
export default function PostCard({post,addUser}) {
    const navigate=useNavigate()
    const {getToken}=useAuth()
    const postWithHashtags = post.content?.replace(
  /(#\w+)/g,
  `<span class="text-indigo-600">$1</span>`
    )
    const [likes, setLikes] = useState(post.likes_count || []);
    const currentUser=post.user
    const handleLikes=async()=>{
        try {
            const {data}=await api.post("/api/post/like",{postId:post._id},{
                headers:{Authorization:`Bearer ${await getToken()}`}
            })
            if(data.success){
                toast.success(data.message) 
                 setLikes((prevLikes) => {
                    if (prevLikes.includes(currentUser._id)) {
                    return prevLikes.filter((id) => id !== currentUser._id);
                    } else {
                    return [...prevLikes, currentUser._id];
                    }
                });   
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    useEffect(()=>{
        
    },[likes]) 
    return (
    <div className="bg-white space-y-4 w-full max-w-2xl p-4 shadow rounded-xl">
      <div >
        <ResponsiveImage onClick={()=>navigate(`/profile/${currentUser._id}`)} className="w-10 h-10 cursor-pointer rounded-full shadow" src={post.user&&currentUser.profile_picture} alt="" />
        <div className="">
            <div onClick={()=>navigate(`/profile/${currentUser._id}`)} className="flex items-center cursor-pointer  space-x-1 ">
                <span>
                    {currentUser.full_name&&currentUser.full_name}
                </span>
                <BadgeCheck className="w-4 h-4 text-blue-500"/>
            </div>
            <div onClick={()=>navigate(`/profile/${currentUser._id}`)} className="text-gray-500 cursor-pointer  text-sm">
                {currentUser.username} . {moment(post.createdAt).fromNow()}
            </div>
        </div>
        <div className=" my-2 ">
        {
            post.content && <div dangerouslySetInnerHTML={{__html: postWithHashtags}} className="text-gray-800 text-sm whitespace-pre-line"/>
        }
        </div>
        <div className="grid grid-cols-2 gap-2">
            {
                post.image_url?.map((img,index)=>(
                    <ResponsiveImage src={img} key={index} className={`w-full h-48 object-cover rounded-lg 
                        ${post.image_url.length===1&&"col-span-2 h-auto"}`} alt="" />
                ))
            }
        </div>
        <div className="flex justify-start gap-2  pt-2 border-t border-gray-300  md:gap-4 items-center">
            <div className="flex-cent text-sm gap-2.5">
                 <Heart
                    className={`w-4 h-4 cursor-pointer ${
                        likes.includes(currentUser._id)? "text-red-500 fill-red-500" : ""
                    }`}
                    onClick={handleLikes}
                />
                <span>{likes?.length}</span> 
            </div> 
            <div className="flex-cent gap-1">
                <MessageCircle className="w-4 h-4"/>
                <span>{12}</span>
            </div>
            <div className="flex-cent gap-1">
                <Share2 className="w-4 h-4"/>
                <span></span>
            </div>
        </div>
      </div>
    </div>
  )
}