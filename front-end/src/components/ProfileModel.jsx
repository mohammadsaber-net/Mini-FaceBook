import { useEffect, useState } from "react"
import { Pencil, X } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { useAuth } from "@clerk/clerk-react"
import { updateUser } from "../redux/user/userSlice.js"
import toast from "react-hot-toast"

export default function ProfileModel({setShowEdit}) {
    const dispatch=useDispatch()
    const {getToken}=useAuth()
    const  user=useSelector(state=>state.user?.user)
    const  loading=useSelector(state=>state.user?.loading)
    const [editForm ,setEditForm]=useState({
        full_name:user.full_name,
        username:user.username,
        bio:user.bio,
        location:user.location,
    })
    const handleProfile=async(e)=>{
        e.preventDefault()
        try {
            const userData=new FormData
            const {full_name,username,bio,location,profile_picture,cover_photo}=editForm
            userData.append("username",username)
            userData.append("full_name",full_name)
            userData.append("bio",bio)
            userData.append("location",location)
            profile_picture && userData.append("profile",profile_picture)
            cover_photo && userData.append("cover",cover_photo)
            const token=await getToken()
            dispatch(updateUser({userData,token}))
        } catch (error) {
            toast.error(error.message)
        }
    }
    useEffect(()=>{
        if(loading){
            setShowEdit(false)
        }
    },[loading])
  return (
      <div className="fixed left-0 right-0 top-0 bottom-0 bg-black/50 z-50 ">
        <div className="relative sm:my-6 max-w-2xl overflow-y-auto h-[calc(100vh-80px)] m-auto ">
            <div className="bg-white shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Edit Profile
                </h2>
                <form action="" className="space-y-4" onSubmit={e=>toast.promise(
                    handleProfile(e),{loading:"saving"}
                )}>
                    <div className="flex flex-col items-start gap-3">
                        <label htmlFor="pictureProfile" className="block text-sm font-medium text-gray-700">
                            Profile Picture
                            <input onChange={(e)=>setEditForm({...editForm,profile_picture:e.target.files[0]})} type="file" accept="image/*" id="pictureProfile" hidden className="
                            rounded-lg w-full border bg-gray-200"/>
                            <div className="group relative">
                                <ResponsiveImage className="size-24 rounded-full object-cover mt-2" src={editForm.profile_picture?URL.createObjectURL(editForm.profile_picture):user.profile_picture} alt="" />
                                <div className="absolute transition-all cursor-pointer duration-200 opacity-0 group-hover:opacity-100 flex top-0 left-0 right-0 bottom-0 bg-black/40 rounded-full items-center justify-center" >
                                <Pencil className="size-5 text-white"/>

                                </div>
                            </div>
                        </label>
                    </div>
                    <div className="flex flex-col items-start gap-3 ">
                        <label htmlFor="coverPhoto"className="
                        block text-sm font-medium text-gray-700
                        ">
                            Cover photo
                            <input type="file" accept="image/*" className="
                            rounded-lg w-full border bg-gray-200"
                            onChange={(e)=>setEditForm({...editForm,cover_photo:e.target.files[0]})}
                            hidden id="coverPhoto"  />
                            <div className="group relative">
                                <ResponsiveImage className="w-80 h-40 rounded-lg object-cover" src={editForm.cover_photo?URL.createObjectURL(editForm.cover_photo):user.cover_photo} alt="" />
                                <div className="absolute rounded-lg transition-all cursor-pointer duration-200 opacity-0 group-hover:opacity-100 flex top-0 left-0 right-0 bottom-0 bg-black/40 items-center justify-center" >
                                <Pencil className="size-5 text-white"/>
                                </div>
                            </div>
                        </label>
                    </div>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            name
                            
                        </label>
                        <input id="name" value={editForm.full_name?editForm.full_name:user.full_name} onChange={(e)=>setEditForm({...editForm,full_name:e.target.value})} type="text" placeholder="enter your name" className="w-full p-3 border-gray-200 border bg-gray-100 focus:outline-none rounded-lg"/>
                    </div>
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                            
                        </label>
                        <input id="username" value={editForm.username?editForm.username:user.username} onChange={(e)=>setEditForm({...editForm,username:e.target.value})} type="text" placeholder="enter your username" className="w-full p-3 border-gray-200 rounded-lg border bg-gray-100 focus:outline-none"/>
                    </div>
                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                            bio
                            
                        </label>
                        <textarea rows={3} id="bio" value={editForm.bio?editForm.bio:user.bio}
                            onChange={(e)=>setEditForm({...editForm,bio:e.target.value})} 
                            placeholder="enter your bio"
                            className="w-full p-3 border bg-gray-100 focus:outline-none border-gray-200 resize-none rounded-lg"/>
                    </div>
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                            location
                            
                        </label>
                        <input id="location" value={editForm.location?editForm.location:user.location} 
                            onChange={(e)=>setEditForm({...editForm,location:e.target.value})} 
                            type="text" placeholder="enter your location"
                            className="w-full p-3 border-gray-200 border bg-gray-100 focus:outline-none rounded-lg"/>
                    </div>
                    <div className="flex justify-end space-x-3 pt-6">
                        <button className={`p-2 text-sm rounded-2xl bg-gradient-to-r
                             flex-cent gap-3 
                            cursor-pointer active:scale-95 px-8 transition-all duration-300 ${loading?"from-indigo-50 to-indigo-100 text-blue-700 border border-indigo-600":"border border-indigo-600 from-indigo-500 to-indigo-700 text-white"}`}>
                            {loading?<div className="flex gap-2">Loading... <span class="loader-btn"></span></div>:"Save Changes"}
                        </button>
                         <button onClick={()=>setShowEdit(false)} className={`p-2 text-sm rounded-2xl bg-gradient-to-r
                            from-red-500 to-red-700 text-white flex-cent gap-3 hover:from-red-600 hover:to-red-800  hover:bg-sky-200
                            cursor-pointer active:scale-95 px-8 transition-all duration-300 ${loading?"pointer-events-none":""}`}>
                            Cancel
                        </button>
                         <button onClick={()=>setShowEdit(false)} className={`p-2 absolute right-1 top-4 text-sm rounded-md border border-red-600
                            cursor-pointer active:scale-95 px-2 hover:bg-red-600 hover:text-white transition-all duration-300${loading?"pointer-events-none":""}`}>
                            <X />
                        </button>
                    </div>
                </form>
            </div>
           
        </div>
    </div>
  )
}
