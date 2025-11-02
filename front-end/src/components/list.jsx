import { ArrowDown, ArrowRight, BookLock, FilePlus, ImagePlus, Megaphone, Newspaper, Search, ShoppingBasket } from 'lucide-react'
import { Link } from 'react-router-dom'
import { FaConnectdevelop, FaUserFriends } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { setShowModel, setShowPost } from '../redux/models/showModels'
import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { fetchBlock } from '../redux/block/block'
import { fetchUser } from '../redux/user/userSlice'

export default function List({setList}) {
  const dispatch=useDispatch()
  const user=useSelector(state=>state.user?.user)
  const [block,setBlock]=useState(false)
  const [blockedUsers, setBlockedUsers] = useState(user.blocked||[])
  const {getToken}=useAuth()
  const handleUnblock = async (blockedId) => {
    try {
      const token = await getToken()
      const result = await dispatch(fetchBlock({ blockedId, token })).unwrap()
      if (!result?.includes(blockedId)) {
        setBlockedUsers(prev => prev.filter(u => u._id !== blockedId))
      }

    } catch (error) {
      console.error("Failed to unblock user:", error)
    }
  }
  useEffect(()=>{
    if(block){
      getToken().then(async(token)=>{
      dispatch(fetchUser(token))
    })
    }
  },[block])
  useEffect(()=>{
    getToken().then(async(token)=>{
      dispatch(fetchUser(token))
    })
  },[dispatch])
  return (
      <>
    
       <div className="fixed z-10000 bg-gray-50 top-0 left-0 sm:right-1/2 bottom-0 sm:top-11 right-0 sm:bottom-0 shadow-md p-4 rounded-md">
      <div className='flex justify-between mb-2 px-2'>
        <Link onClick={()=>setList(false)} to={"/discover"} className='size-8 sm:hidden flex justify-center items-center rounded-full bg-gray-200'>
          <Search className='sm:hidden'/>
        </Link>
        <div className='flex items-center gap-2'>
          <h2 className='text-2xl'>List</h2>
          <ArrowRight onClick={()=>setList(false)} className='cursor-pointer sm:hidden'/>
        </div>
      </div>
      <div className='bg-white p-2 mb-4 flex justify-between items-center rounded-md shadow max-w-96 m-auto'>
        <div className='size-8 flex justify-center items-center rounded-full bg-gray-200'>
          <ArrowDown />
        </div>
        <Link to={`/profile/${user._id}`} onClick={()=>setList(false)} className='flex gap-2 items-center'>
          <p className='text-gray-700'>
            {user.full_name}
          </p>
          <img src={user.profile_picture} alt={user.full_name} className='w-10 h-10 rounded-full'/>
        </Link>
      </div>
      <div className='flex text-sm sm:text-base gap-3'>
        <div className='bg-white shadow-md min-h-80 p-2 w-42 rounded-lg'>
          <h3 className='mt-0 mb-4 border-b border-gray-300'>Create</h3>
          <Link className='gap-1 transition hover:bg-gray-200 p-2 rounded-sm mb-4 flex align-center' onClick={() => {dispatch(setShowPost(true));setList(false)}}>
           <span className='size-8 bg-gray-200 flex-cent rounded-full'>
            <FilePlus className='size-4'/>
           </span>
            Post
          </Link>
          <div className='gap-1 transition hover:bg-gray-200 p-2 rounded-sm mb-4 cursor-pointer flex align-center' onClick={() =>{dispatch(setShowModel(true));setList(false)}}>
           <span className='size-8 bg-gray-200 flex-cent rounded-full'>
            <ImagePlus className='size-4'/>
           </span>
           Story
          </div>
          <Link onClick={()=>setList(false)} className='gap-1 transition hover:bg-gray-200 p-2 rounded-sm cursor-pointer flex align-center' to={"/sponsore"}>
           <span className='size-8 bg-gray-200 flex-cent rounded-full'>
            <Megaphone className='size-4'/>
           </span>
           Advertisement
          </Link>
        </div>
      <div className='bg-white shadow-md overflow-x-auto h-96 p-2 w-64 rounded-lg'>
        <div className='mt-0 mb-4 border-b border-gray-300'>
          <h3>community</h3>
        <Link onClick={()=>setList(false)} to={"/connections"} className='gap-1 transition hover:bg-gray-200 p-2 rounded-sm cursor-pointer flex align-center'>

            <div className=''>
              <FaConnectdevelop className='text-blue-600 size-6'/>
            </div>
            <div>
              <h4>connections</h4>
              <p className='text-gray-500'>connect with your friends</p>
            </div>
        </Link>
        <Link onClick={()=>setList(false)} to={"/"} className='gap-1 transition hover:bg-gray-200 p-2 rounded-sm cursor-pointer flex align-center'>

            <div className=''>
              <Newspaper className='text-sky-600 size-6'/>
            </div>
            <div>
              <h4>Posts</h4>
              <p className='text-gray-500'>view your posts</p>
            </div>
        </Link>
        <Link onClick={()=>setList(false)} to={"/friends"} className='gap-1 transition hover:bg-gray-200 p-2 rounded-sm cursor-pointer flex align-center'>

            <div className=''>
              <FaUserFriends className='text-sky-600 size-6'/>
            </div>
            <div>
              <h4>Friends</h4>
              <p className='text-gray-500'>view your friends</p>
            </div>
        </Link>
        </div>
        <div>
          <h3>Shopping</h3>
          <Link onClick={()=>setList(false)} to={"/sponsore"} className='gap-1 transition hover:bg-gray-200 p-2 rounded-sm cursor-pointer flex align-center'>

            <div className=''>
              <ShoppingBasket className='text-sky-600 size-6'/>
            </div>
            <div>
              <h4>marketPlace</h4>
              <p className='text-gray-500'>view your marketPlace</p>
            </div>
        </Link>
        </div>
        <div className=''>
          <h3>Users</h3>
          <div onClick={()=>setBlock(!block)}className='gap-1 relative transition hover:bg-gray-200 p-2 rounded-sm cursor-pointer flex align-center'>

            <div className=''>
              <BookLock className='text-sky-600 size-6'/>
            </div>
            <div>
              <h4>block</h4>
              <p className='text-gray-500'>view your blocked list</p>
            </div>
            
        </div>
        </div>
         <div className={`w-full ${block?'h-16':'h-0'} bg-white transition-all duration-300 rounded-md max-h-60 overflow-y-auto`}>
              <div>
                {blockedUsers.length>0?blockedUsers.map(user=>(
                  <div key={user._id} className='py-1 flex justify-between items-center border-b border-gray-200'>
                    <div className='flex items-center'>
                      <img src={user.profile_picture} alt={user.full_name} className='w-8 h-8 rounded-full mr-2'/>
                      <span className='text-gray-700'>{user.full_name}</span>
                    </div>
                    <button className='bg-gray-700 text-white cursor-pointer px-2 py-1 rounded-md focus:scale-95' onClick={() => handleUnblock(user._id)}>Unblock</button>
                  </div>
                )): <p className='text-gray-500 mt-2'>No users blocked</p>}
              </div>
            </div>
        </div>
       
      </div>
      
    </div>
    </>
  )
}
