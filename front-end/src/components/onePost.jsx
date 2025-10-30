import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Loading from './Loading'
import PostCard from './postCard'
import { useParams } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import api from '../api/axios'

export default function OnePost() {
    const postId=useParams().postId
    const {getToken}=useAuth()
    const [post,setPost]=useState(null)
    const [loading,setLoading]=useState(false)
    const getPost=async()=>{
        const token=await getToken()
        console.log("fetching post",postId)
        setLoading(true)
        try {
            const {data}=await api.post(`/api/post/getPost/${postId}`,{},
                {headers:{Authorization:`Bearer ${token}`}}
            )
            if(data.success){
                setPost(data.post)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.error("error,",error)
            toast.error(error.message)
        }
        setLoading(false)
    }
    console.log(post)
    useEffect(()=>{
        getPost()
    },[])
    return !loading?(
    <div className="mt-16 sm:mt-4 mb-10 min-h-[76vh]">
        {
            post? <PostCard post={post} /> : <div className="text-center text-gray-500">Post not found</div>
        }
    </div>
  ):<Loading />
}
