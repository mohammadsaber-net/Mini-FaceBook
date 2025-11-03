import { useEffect, useState } from "react"
import { BadgeCheck, Heart, MessageCircle, Share2, ThumbsUp } from "lucide-react"
import moment from "moment"
import { Link, useLocation, useNavigate } from "react-router-dom"
import api from "../api/axios.js";
import { useAuth } from "@clerk/clerk-react"
import toast from "react-hot-toast"
import { useSelector } from "react-redux";
import ResponsiveImage from "./responsiveImage.jsx";
import { FaComment, FaShare } from "react-icons/fa";
import LeaveComment from "./LeaveComment.jsx";
export default function PostCard({post,id,addUser}) {
    const navigate=useNavigate()
    const {getToken}=useAuth()
    const ruserId=useSelector(state=>state.user?.user._id)
    const userId = id || ruserId;
    const location=useLocation()
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
                    if (prevLikes.includes(userId)) {
                    return prevLikes.filter((id) => id !== userId);
                    } else {
                    return [...prevLikes, userId];
                    }
                });   
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    return (
    <div  className="bg-white space-y-4 w-full max-w-md m-auto mb-2 p-4 shadow rounded-xl">
        
      <div >
        <img  onClick={()=>navigate(`/profile/${currentUser._id}`)} className="w-10 h-10 cursor-pointer rounded-full shadow" src={post.user&&currentUser.profile_picture} alt="" />
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
        <div className="flex justify-between align-center border-t border-gray-200 p-2">
            <div className="flex gap-4 align-center">
                <div className="flex gap-1 align-center">
                    <FaShare className="text-gray-500"/>
                    <span></span>
                </div>
                <div className="flex gap-1 align-center">
                    <FaComment className="text-gray-500"/>
                     <span>{post.comment.length}</span>
                </div>
            </div>
            <div className="flex gap-1 align-center">
                <ThumbsUp className="text-gray-600"/>
                <span>{likes?.length> 0 ? likes.length : ""}</span>
            </div>
        </div>
        <div className="flex justify-between text-sm sm:text-base px-2 pt-2 border-t border-gray-300  md:gap-4 items-center"> 
            <div className="flex-cent cursor-pointer gap-1">
                Share
                <FaShare className="w-4 h-4"/>
            </div>
            <Link to={`post/${post._id}`} className={`flex-cent gap-1 ${
                location.pathname.startsWith(`/post/${post._id}`) ? "text-blue-600 pointer-events-none fill-blue-600":"cursor-pointer"
            }`}>
               Comment 
                <MessageCircle className="w-4 h-4"/>
            </Link>
            <div onClick={handleLikes} className="flex-cent cursor-pointer text-sm gap-2.5">
                 Like <ThumbsUp
                    className={`w-4 h-4 ${
                        likes.includes(userId)
                        ? "text-blue-600 fill-blue-600" : "text-gray-600 fill-gray-600"
                    }`}
                />
            </div>
        </div>
      </div>
      {location.pathname.startsWith(`/post/${post._id}`) && (
          <LeaveComment postId={post._id} comments={post.comment} />
        )}
    </div>
  )
}