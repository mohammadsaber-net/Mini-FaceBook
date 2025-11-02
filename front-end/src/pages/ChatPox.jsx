import { useEffect, useRef, useState } from "react"
import { dummyMessagesData, dummyUserData } from "../assets/assets.js"
import { Image, ImageIcon, SendHorizonal } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "@clerk/clerk-react"
import { addMessages, fetchMessages, resetMessages } from "../redux/messages/messages.js"
import toast from "react-hot-toast"
import api from "../api/axios.js"
function ChatBox(){
    const {messages}=useSelector(state=>state.messages)
    const {userId}=useParams()
    const {getToken}=useAuth()
    const dispatch=useDispatch()

    const blockedUser=useSelector(state=>state.user?.user)
    const [user,setUser]=useState(null)
    const [text,setText]=useState("")
    const [image, setImage]=useState(null)
    const messageEndRef=useRef(null)
    const connections=useSelector(state=>state.connections.connections)
    const fetchUsersMessages=async()=>{
        try {
            const token=await getToken()
            dispatch(fetchMessages({token,userId}))
        } catch (error) {
            toast.error(error.message)
        }
    }
    const sendMessage=async()=>{
        try {
            if(!text&&!image) return
            const formData=new FormData()
            formData.append("text",text)
            formData.append("to_user_id",userId)
            image&&formData.append("image",image)
            const {data}=await api.post("/api/message/send",formData,{
                headers:{Authorization:`Bearer ${await getToken()}`}
            })
            if(data.success){
                setText("")
                setImage(null)
                dispatch(addMessages(data.message))
                fetchUsersMessages()
            }else{
                throw new Error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    const navigate=useNavigate()
    useEffect(()=>{
        fetchUsersMessages()
        return ()=>{
            dispatch(resetMessages())
        }
    },[userId])
    useEffect(()=>{
        if(connections.length>0){
            const user=connections.find(connection=>connection._id===userId)
            setUser(user)
        }
    },[connections,userId])
    useEffect(()=>{
        messageEndRef.current?.scrollIntoView({behavior:"smooth"})
    },[messages])
    return(
        <div className="flex flex-col min-h-[calc(100vh-90px)] sm:min-h-[calc(100vh-45px)] mt-14 sm:mt-3 pt-2">
            <div className="flex items-center gap-2 md:px-10 xl:pl-24 bg-gradient-to-r from-indigo-100
            to-purple-100 border-b border-gray-300">
                <img src={user?.profile_picture} onClick={()=>navigate(`/profile/${user._id}`)} className="size-8 cursor-pointer rounded-full" alt="" />
                <div >
                    <p className="font-medium ">
                        {
                            user?.full_name
                        }
                    </p>
                    <p className="text-sm to-gray-500">
                        @{
                            user?.username
                        }
                    </p>
                </div>
            </div>
                <div className="p-5 md:px-10 h-full overflow-y-auto">
                    <div className="space-y-4 max-w-full mx-auto">
                        {
                            messages?.toSorted((a,b)=>new Date(a.createdAt) - new Date(b.createdAt) ).map((message,index)=>(
                                <div key={index} className={`flex flex-col ${message.to_user_id !== userId?"items-start":"items-end"}`}>
                                    <div className={` text-sm max-w-sm ${message.message_type === "image"?"":"p-2"} rounded-lg shadow ${message.to_user_id !== userId?"rounded-bl-none bg-white text-gray-900":"rounded-br-none bg-blue-600 text-white "}`}>
                                        {
                                            message.message_type === "image" && <img src={message.media_url}className="w-full max-w-sm rounded-lg" alt="" />
                                        }
                                        <p>{message.text}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div ref={messageEndRef}>
                </div>
                {blockedUser.blocked.includes(userId)?<div>
                    you can't message this user, you are no longer friends<p>You have blocked this user</p>
                </div>:<div className="px-4 mt-auto mb-0">
                    <div className="flex items-center gap-1 sm:gap-3 pl-5 p-1.5 w-full bg-white max-w-xl mx-auto border border-gray-300 shadow rounded-lg mb-5">
                    
                        <input className="flex-1 outline-none text-slate-700" placeholder="type a message" onKeyDown={e=>e.key==="Enter"&& sendMessage()}
                        onChange={(e)=>setText(e.target.value)} value={text}
                        type="text" />
                        <label htmlFor="image">
                            {
                                image?<img src={URL.createObjectURL(image)} className="size-8 rounded-full" alt="" />:
                                <ImageIcon className="size-7 text-gray-400 cursor-pointer"/>
                            }
                            <input onChange={(e)=>setImage(e.target.files[0])} id="image" type="file" hidden accept="image/*" />
                        </label>
                            <button onClick={sendMessage} className="p-2 text-sm rounded-full bg-gradient-to-r
                                  from-indigo-500 to-indigo-700 text-white flex-cent gap-3 hover:from-indigo-600 hover:to-indigo-800  hover:bg-sky-200
                                cursor-pointer active:scale-95 w-10 h-10 transition-all duration-300"
                            >
                                <SendHorizonal size={18}/>
                            </button>
                    </div>
                </div>}
            </div>
        
    )
}
export default ChatBox