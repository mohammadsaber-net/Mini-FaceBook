import { UserButton } from '@clerk/clerk-react'
import { Home, ListIcon, ListTodo, Menu, MessageCircle, Search, ShoppingBasket } from 'lucide-react'
import { useState } from 'react'
import { FaFacebook, FaUserFriends } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'
import List from './list'
export default function Navbar() {
    const [list,setList]=useState(false)
  return (
    <div className='bg-white flex flex-col sm:flex-row justify-between py-1 shadow-md fixed top-0 left-0 z-50 px-5 w-screen'>
      <div className='hidden justify-start gap-3 hidden sm:flex  items-center'>
        <NavLink className={({ isActive }) =>`flex-cent hover:bg-gray-300 transition cursor-pointer size-10 active:scale-95 rounded-full bg-gray-200${isActive ? 'text-blue-600' : 'text-gray-950'}`}>
            <UserButton />
        </NavLink>
        <NavLink to={`/messages`} className={({ isActive }) =>`flex-cent hover:bg-gray-300 transition cursor-pointer active:scale-95 size-10 rounded-full bg-gray-200 ${isActive ? 'text-blue-600' : 'text-gray-950'}`}>
            <MessageCircle />
        </NavLink>
        <div className='relative'>
          <div onClick={()=>setList(!list)} className={`size-10 flex-cent cursor-pointer hover:bg-gray-300 active:scale-95 transition rounded-full bg-gray-200 ${list ? 'text-blue-600' : 'text-gray-950'}`}>
            <Menu />
        </div>
            {list&&<List setList={setList}/>}
        </div>
      </div>
      <div className=' justify-between hidden sm:flex items-center'>
        <NavLink to={`/connections`} className={({ isActive }) =>`relative w-20 ${isActive?"text-blue-600 before:opacity-100":"before:opacity-0"}  h-full flex-cent rounded-md hover:bg-gray-200  mx-1 transition before:w-full before:h-1 before:z-10 before:absolute before:-bottom-1 before:left-0 before:bg-blue-600 before:content-['']`}>
        <FaUserFriends className='size-5'/>
        </NavLink>
        <NavLink to={`/`} className={({ isActive }) =>` ${isActive?"text-blue-600 before:opacity-100":"before:opacity-0"} mx-1 relative w-20 h-full flex-cent rounded-md hover:bg-gray-200 transition before:w-full before:h-1 before:z-10 before:absolute before:-bottom-1 before:left-0 before:bg-blue-600 before:content-['']`}>
        <Home className='size-5'/>
        </NavLink>
      </div>
      <div className='flex gap-2 justify-between sm:justify-end '>
        <div className='flex-cent gap-4'>
        <div onClick={()=>setList(!list)} className={`size-10 flex justify-center items-center sm:hidden hover:bg-gray-300 active:scale-95 transition rounded-full bg-gray-200 ${list ? 'text-gray-600' : 'text-gray-950'}`}>
            <Menu />
        </div>
        {list&&<List setList={setList}/>}
        <NavLink to={"/discover"} className='w-10 bg-gray-200 flex-cent rounded-full h-10'>
            <Search className='text-gray-600 size-5'/>
        </NavLink>
        </div>
        <NavLink to={"/"}>
          <FaFacebook className='text-blue-700 hidden sm:block size-10'/>
          <span className='font-bold text-blue-700 text-2xl sm:hidden'>facebook</span>
        </NavLink>
      </div>
      <div className='sm:hidden px-2 mt-1 flex justify-between items-center'>
        <NavLink to={`/sponsore`} className={({ isActive }) =>`flex-cent hover:bg-gray-200 transition cursor-pointer active:scale-95 h-10 w-16 rounded-lg ${isActive ? 'text-blue-600' : 'text-gray-950'}`}>
            <ShoppingBasket className='text-gray-600'/>
        </NavLink>
        <NavLink to={`/messages`} className={({ isActive }) =>`flex-cent hover:bg-gray-200 transition cursor-pointer active:scale-95 h-10 w-16 rounded-lg ${isActive ? 'text-blue-600' : 'text-gray-950'}`}>
            <MessageCircle className='text-gray-600'/>
        </NavLink>
        <NavLink to={`/connections`} className={({ isActive }) =>`flex-cent hover:bg-gray-200 transition cursor-pointer active:scale-95 h-10 w-16 rounded-lg ${isActive ? 'text-blue-600' : 'text-gray-950'}`}>
        <FaUserFriends className='text-gray-600 size-8'/>
        </NavLink>
        <NavLink to={`/`} className={({ isActive }) =>`flex-cent hover:bg-gray-200 transition cursor-pointer active:scale-95 h-10 w-16 rounded-lg ${isActive ? 'text-blue-600' : 'text-gray-950'}`}>
        <Home className='text-gray-600'/>
        </NavLink>
      </div> 
    </div>
  )
}
