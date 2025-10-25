import { MapPin, MessageCircle, Plus, 
    ToyBrick, 
    UserPlus } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { useAuth } from '@clerk/clerk-react'
import api from '../api/axios.js'
import { fetchUser } from "../redux/user/userSlice.js"
import { useNavigate } from "react-router-dom"

export default function UserCard(users) {
    const user=users.user
    const {getToken}=useAuth()
    const currentUser=useSelector(state=>state.user?.user)
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const handleFollow=async()=>{
          try {
            const {data}=await api.post("/api/user/follow",{id:user._id},{
                headers:{Authorization:`Bearer ${await getToken()}`}
            })
            if(data.success){
                toast.success(data.message)
                dispatch(fetchUser(await getToken()))
            }else{
                toast.success(data.message)
            }
        } catch (error) {
            toast.success(error.message)
        }
    }
    const handleConnectionsRequests=async()=>{
        if(currentUser.connections.includes(user._id)){
            return navigate(`/messages/${user._id}`)
        }
        try {
            const {data}=await api.post("/api/connection/send",{id:user._id},{
                headers:{Authorization:`Bearer ${await getToken()}`}
            })
            if(data.success){
                toast.success(data.message)
            }else{
                toast.success(data.message)
            }
        } catch (error) {
            toast.success(error.message)
        }
    }
  return (
    <div key={user._id} className='p-4 pt-6 flex max-w-64 bg-white flex-col justify-between rou-md
     border-gray-200 border'>
        <div className='text-center'>
        <img src={user.profile_picture} className='size-8
         rounded-full mx-auto shadow-md' alt="" />
         <p className='font-semibold mt-4 text-blue-600'>
            {user.full_name}
         </p>
         {
            user.username&&<p className='text-gray-600 mt-2'>{user.username}</p>
         }
         {
             user.bio&&<p className='text-slate-600 text-center text-sm px-4'>
                {user.bio}
            </p>
         }
         </div>
         <div className='flex-cent gap-2 mt-2 text-gray-600 text-xs'>
            <div className='flex items-center gap-1 border-gray-200 border px-3 py-1 rounded-full'>
                <MapPin  className='size-4'/> {user.location}
            </div>
            <div className='flex items-center gap-1 border-gray-200 border px-3 py-1 rounded-full'>
                <span>{user.followers.length}</span> Followers
            </div>
         </div>
         <div className='flex mt-4 gap-2'>
            <button onClick={handleFollow}
            disabled={currentUser?.following.includes(user._id)}
             className={`p-2 text-sm rounded-2xl text-white flex-cent
                 gap-3 active:scale-95 w-full transition-all duration-300 
              ${currentUser?.following.includes(user._id)?"bg-gray-800":" bg-gradient-to-r hover:from-indigo-600 cursor-pointer hover:to-indigo-800 from-indigo-500 to-indigo-700"}`}
            >
                <UserPlus className='size-4' />
                {currentUser?.following.includes(user._id)?"following":"follow"}
            </button>
            <button onClick={handleConnectionsRequests} className='flex-cent rounded-md w-16 group text-slate-500 border cursor-pointer active:scale-95'>
                {
                    currentUser?.connections.includes(user._id)?<MessageCircle className='size-5 group-hover:scale-105 transition'/>
                    :<Plus className='size-5 group-hover:scale-105 transition'/>
                }

            </button>
         </div>
    </div>

  )
}
