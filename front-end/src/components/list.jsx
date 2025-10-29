import { ArrowDown, ArrowLeft, ArrowRight, FilePlus, ImagePlus, Megaphone, Newspaper, Search, ShoppingBasket } from 'lucide-react'
import { Link } from 'react-router-dom'
import StoryModel from './StoryModel'
import { FaUserFriends } from 'react-icons/fa'
import CreatePosts from '../pages/CreatePost'
import { useDispatch, useSelector } from 'react-redux'
import { setShowModel, setShowPost } from '../redux/models/showModels'

export default function List({setList}) {
  const dispatch=useDispatch()
  const user=useSelector(state=>state.user?.user)
  // "
  //       bg-gray-50 p-3 shadow-md
  //       fixed inset-0 z-50 rounded-none
  //       sm:absolute sm:inset-auto sm:top-12 sm:left-1/2 sm:-translate-x-1/2 sm:z-10 
  //        sm:min-w-96 sm:min-h-96 sm:rounded-lg sm:w-auto sm:h-auto
  //       "
  return (
      <>
    
       <div className="fixed top-0 left-0 sm:right-1/3 bottom-0 sm:top-11 right-0 sm:bottom-1/4 z-50 bg-gray-50 shadow-md p-4 rounded-md z-50">
      <div className='flex justify-between mb-2 px-2'>
        <Link onClick={()=>setList(false)} to={"/discover"} className='size-8 sm:hidden flex justify-center items-center rounded-full bg-gray-200'>
          <Search className='sm:hidden'/>
        </Link>
        <div className='flex items-center gap-2'>
          <h2 className='text-2xl'>List</h2>
          <ArrowRight onClick={()=>setList(false)} className='cursor-pointer sm:hidden'/>
        </div>
      </div>
      <div className='bg-white sm:hidden p-2 mb-4 flex justify-between items-center rounded-md shadow max-w-96 m-auto'>
        <div className='size-8 sm:hidden flex justify-center items-center rounded-full bg-gray-200'>
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
      <div className='bg-white shadow-md min-h-80 p-2 w-64 rounded-lg'>
        <div className='mt-0 mb-4 border-b border-gray-300'>
          <h3>community</h3>
        <Link onClick={()=>setList(false)} to={"/connections"} className='gap-1 transition hover:bg-gray-200 p-2 rounded-sm cursor-pointer flex align-center'>

            <div className=''>
              <FaUserFriends className='text-blue-600 size-6'/>
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
        </div>
      </div>
    </div>
    </>
  )
}
