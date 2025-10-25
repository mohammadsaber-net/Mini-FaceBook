import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assets, dummyUserData } from '../assets/assets'
import { useClerk, UserButton } from '@clerk/clerk-react'
import { CirclePlus, LogOut } from 'lucide-react'
import MenuItems from './menuItems'
import { useSelector } from 'react-redux'
export default function SideBar({sideOpen,setSideOpen}) {
    const navigate=useNavigate()
    const user=useSelector(state=>state.user?.user)
    const {signOut}=useClerk()
  return (
        <div className="relative ">
    <div className={`w-44 absolute h-[calc(100vh-32px)] top-0 mt-8 left-0 z-30 sm:w-48 pt-4 sm:static border-gray-300 border-e-2 bg-white ${sideOpen?"-translate-x-0":"max-sm:-translate-x-full"}  transition-all duration-300 ease-in-out`}>
      <div className="w-full">
        {/* <div className='text-center'>
        <FaFacebook onClick={()=>navigate("/")} className='size-8 m-auto text-blue-700 mb-2 md:mb-4 ml-7 cursor-pointer' />
        </div>
      <hr className='border-gray-300 mb-8'/> */}
      <MenuItems setSideOpen={setSideOpen}/>
      <Link to={"/createPost"} className='flex w-fit m-auto mb-3 px-4 md:px-8 border-b-2 border-gray-300 py-2 rounded-xl gap-2 bg-gradient-to-r hover:from-blue-900 hover:to-blue-700 duration-300 transition-all from-blue-700 to-blue-900  text-white'>
      <CirclePlus />
      createPost
      </Link>
      </div>
      <div className='w-full flex mt-auto mb-0 flex-col border-t-2 border-gray-300 p-4'>
        <UserButton />
        <div>
            <h1>{user.full_name}</h1>
            <p className='text-gray-400'>@{user.username}</p>
        </div>
        <LogOut onClick={signOut} className='cursor-pointer w-6 text-3xl text-gray-400 m-auto hover:text-gray-700 transition-all'/>
      </div>
    </div>
    </div>
  )
}
