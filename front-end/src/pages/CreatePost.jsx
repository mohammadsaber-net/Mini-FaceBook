import { useState } from "react"
import { Image, X } from "lucide-react"
import {toast} from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { useAuth } from "@clerk/clerk-react"
import api from "../api/axios.js"
import { useNavigate } from "react-router-dom"
import { setShowPost } from "../redux/models/showModels.js"

function CreatePosts(){
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const data=useSelector(state=>state.user?.user)
    const [content,setContent]=useState("")
    const [image,setImage]=useState([])
    const [loading,setLoading]=useState(false)
    const {getToken}=useAuth()
    const handleSubmit=async()=>{
        setLoading(true)
        if(image.length<=0 && !content){
            toast.error("please add at least one image or text")
        }else{
            const postType=image.length > 0&&content?"image_with_text":image.length>0?"image":"text"
        try {
            const formData=new FormData()
            formData.append("content",content)
            formData.append("post_type",postType)
            image.map(img=>{
                formData.append("image",img)
            })
            const {data}=await api.post("/api/post/add",formData,{
                headers:{Authorization:`Bearer ${await getToken()}`}
            })
            if(data.success){
                navigate("/")
                toast.success("post added")
                dispatch(setShowPost(false))
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
        }
        setLoading(false)
    }
    return(
    <div className="fixed top-0 left-0 right-0 z-1000 bottom-0 flex-cent bg-black/10">        
        <div className="max-w-6xl relative  rounded-xl bg-white p-6 shadow-md mx-auto w-96">
        <div onClick={()=>dispatch(setShowPost(false))} className="absolute Z-10 text-gray-600 size-10 bg-gray-100 rounded-full flex-cent hover:bg-gray-200 transition top-4 right-4 cursor-pointer">
            <X />
        </div>
            <div className="border-b border-gray-300 text-center pb-2">
                <h2 className="text-2xl text-slate-900">
                    Create Post
                </h2>
            </div>
            <div className="max-w-xl p-2 bg-white space-y-4">
                <div className="flex items-center justify-end gap-3">
                    <div>
                        <h3 className="text-gray-700 ">
                            {data.full_name}
                        </h3>
                        <p className="text-sm text-gray-500 ">
                            @{data.username}
                        </p>
                    </div>
                    <img src={data.profile_picture} className="size-12 rounded-full" alt="" />
                </div>
                <textarea name="" className="w-full resize-none h-22 overflow-y-auto text-sm outline-none placeholder-gray-400" id="" placeholder="what's happeing" onChange={(e)=>setContent(e.target.value)} value={content}></textarea>
                {
                    image.length > 0 && <div className="flex flex-wrap gap-2 p-2">
                        {
                            image.map((img,index)=>(
                                <div key={index} className="relative group">
                                    <img src={URL.createObjectURL(img)} className="h-20 rounded-md" alt="" />
                                    <div className="absolute hidden group-hover:flex justify-center items-center top-0 left-0 right-0 bottom-0 bg-black/40 rounded-md cursor-pointer" onClick={()=>setImage(image.filter((_,i)=>i !== index))}>
                                    <X className="text-white"/>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                }
                <div className="flex justify-around align-center p-2 border border-gray-300">
                    <label htmlFor="images" className="flex items-center gap-2 text-sm text-green-500 hover:text-green-600 transition cursor-pointer">
                        <Image className="size-6 "/>  
                    </label>
                    <input type="file" id="images" accept="image/*" hidden multiple onChange={(e)=>setImage([...image,...e.target.files])}/>
                    <div className="text-gray-700">
                    add to your post    
                    </div>  
                 </div>
                 <div className="flex-cent">
                    <button disabled={(image.length === 0 && content.length === 0) || loading} onClick={()=>toast.promise(
                            handleSubmit(),{
                            loading:"uploading"
                                }
                            )} className={`flex-cent text-sm bg-gradient-to-r from-indigo-500 
                            to-purple-600 hover:from-indigo-600 active:scale-95 transition 
                            text-white font-medium px-8 py-2 rounded-md cursor-pointer 
                            hover:to-purple ${(image.length === 0 && content.length === 0) || loading?"opacity-50 pointer-events-none":""}`} >
                                Publish post
                            </button>
                 </div>
            </div>
        </div>  
    </div>
    )
}
export default CreatePosts