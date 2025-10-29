import React, { useEffect, useState } from 'react'
import {Link, useParams} from 'react-router-dom'
import {dummyPostsData, dummyUserData} from "../assets/assets.js"
import { use } from 'react'
import PostCard from '../components/postCard.jsx'
import moment from 'moment'
import Loading from '../components/Loading.jsx'
import UserProfileInfo from '../components/UserProfileInfo.jsx'
import ProfileModel from '../components/ProfileModel.jsx'
import { useAuth } from '@clerk/clerk-react'
import { useDispatch, useSelector } from 'react-redux'
import api from '../api/axios.js'
import toast from 'react-hot-toast'
export default function Profile() {
    const {profileId}=useParams()
    const [addPost,setAddPost]=useState([])
    const [addUser,setAddUser]=useState(null)
    const [activeTab,setActiveTab]=useState("addPost")
    const [showEdit,setShowEdit]=useState(false)
    const currentUser=useSelector(state=>state.user?.user)
    const {getToken}=useAuth()
    const fetchUser=async(id)=>{
        const token=await getToken()
        try {
            const {data}=await api.post("/api/user/profiles",{id},{
                headers:{Authorization:`Bearer ${token}`}
            })
            if(data.success){
                setAddUser(data.profile)
                setAddPost(data.posts)
                toast.success(data.message)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    useEffect(()=>{
        if(profileId){
            fetchUser(profileId)
        }else{
            fetchUser(currentUser._id)
        }
    },[profileId,currentUser])
  return addUser?(
    <div className='relative overflow-y-scroll mt-10 sm:mt-4 p-6'>
      <div className='max-w-3xl mx-auto'>
        <div className='rounded-2xl  bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 shadow overflow-hidden'>
            <div className='h-32 sm:h-48'>
                {
                    addUser.cover_photo&&
                    <img src={addUser.cover_photo} className='w-full h-full object-cover' alt="" />
                }
            </div>
                <UserProfileInfo addPost={addPost} addUser={addUser} profileId={profileId} setShowEdit={setShowEdit}/>
        </div>
            <div className='my-2'>
                <div className='bg-white rounded-xl flex justify-between shadow max-w-md mx-auto'>
                    {
                        ["addPost","media","likes"].map((tab)=>(
                            <button key={tab} onClick={()=>setActiveTab(tab)} className={`flex-1 px-4 py-2 rounded-lg transition-colors text-sm relative z-50 font-medium cursor-pointer ${activeTab===tab?"bg-indigo-600 text-white":"text-gray-600 hover:text-gray-900"} `}>
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}

                            </button>
                        ))
                    }
                </div>
                </div>
                {
                    activeTab === "addPost"&&
                    <div className='flex-col items-center gap-6 flex '>     
                       {addPost.map((post)=>{
                        console.log(post)
                        return(
                            <PostCard key={post._id} addUser={addUser} post={post} />
                        )})
                        }
                    </div>
                }
                {
                    activeTab === "media"&&
                    <div className='flex flex-wrap max-w-6xl '>
                        {
                            addPost.filter((post)=>post.image_urls.length>0).map((post)=>(
                                <>
                                {
                                    post.image_urls.map((image,index)=>(
                                        <Link className='relative group' target='_blank' to={image} key={index}>
                                            <img src={image} key={index} className='w-64 object-cover aspect-video' alt="" />
                                            <p className='absolute bottom-0 right-0 text-xs p-1 px-3 backdrop-blur-xl text-white group-hover:opacity-100 transition duration-200'>
                                                posted {moment(post.createdAt).fromNow()}
                                            </p>
                                        </Link>
                                    ))
                                }
                                </>
                            ))
                        }

                    </div>
                }

      </div>
      {
        showEdit&&<ProfileModel setShowEdit={setShowEdit}/>
      }
    </div>
  ):<Loading />
}
