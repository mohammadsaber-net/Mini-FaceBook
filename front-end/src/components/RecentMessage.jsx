import { useEffect, useState } from 'react'
import { assets} from '../assets/assets'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from '@clerk/clerk-react'
import { fetchRecentMessages } from '../redux/messages/recentMessages'
export default function RecentMessage() {
  const {messages}=useSelector(state=>state.recentMessage)
  const {getToken}=useAuth()
  const [message,setMessage]=useState([])
    const dispatch=useDispatch()
    useEffect(()=>{
      getToken().then(token=>{
        dispatch(fetchRecentMessages(token))
      })
    },[])
    useEffect(()=>{
      setMessage(messages)
    },[message])
  return (
    <div className='w-full min-h-[calc(100vh-220px)] text-xs sm:text-base bg-white rounded-md p-1 text-slate-800'>
      {message.length===0&&<div className='text-blue-600'>
        No Messages yet
        </div>}
      <div className='flex flex-col bg-white'>
        {message.map((mes,ind)=>{
            return(<Link to={`/messages/${mes.from_user_id._id}`} key={ind} className='flex group items-center p-1 hover:bg-blue-400 transition-all hover:text-white duration-200 mb-2 shadow'
            >
                <img src={mes.profile_picture || assets.sample_profile} className='w-8 h-8 rounded-full' alt="" />
                <div className='w-full ms-2'>
                    <div className='flex justify-between'>
                        <p className='font-medium overflow-hidden'>{mes.from_user_id.full_name || "ali"}</p>
                        <p className='text-[8px]'>{moment(mes.createdAt).fromNow()}</p>
                    </div>
                    <div className='flex justify-between'>
                       <p className='text-gray-500 group-hover:!text-white transition-colors duration-200'>
                        {mes.text?mes.text:"media"}
                        </p> 
                        {
                            !mes.seen&& <p className='bg-indigo-500 text-white w-4 h-4 flex-cent rounded-full text-[10px]'>1</p>
                        }
                    </div>
                </div>
            </Link>
        )})}
      </div>
    </div>
  )
}
