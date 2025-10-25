import { LogOut, Menu, X } from "lucide-react"
import Loading from "../components/Loading"
import { dummyUserData } from "../assets/assets.js"
import { useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import SideBar from "../components/sideBar.jsx"
import { FaFacebook } from "react-icons/fa"
import { useSelector } from "react-redux"

function LayOut(){
    const user=useSelector(state=>state.user?.user)
    const navigate=useNavigate()
    const [sideOpen,setSideOpen]=useState()
    return user?(
        <div className="flex relative ">
            <div className="w-full h-10 z-50 flex justify-end sm:justify-center items-center pe-1 sm:pe-0 text-right bg-blue-600 absolute top-0 left-0">
                <FaFacebook onClick={()=>navigate("/")} className=" cursor-pointer text-white size-8"/>
            </div>
            <SideBar sideOpen={sideOpen} setSideOpen={setSideOpen} />
            <div className="bg-gray-100 mt-8 w-screen sm:w-[calc(100vw-200px)]">
                <Outlet />
            </div>
            <div className={`sm:hidden absolute top-3 z-50 ${sideOpen?"text-white left-36":"text-white  left-3"} transition-all duration-300`}>
            {sideOpen?<X onClick={()=>setSideOpen(false)}/>:<Menu  onClick={()=>setSideOpen(true)}/>}
            </div>
        </div>
    ):(
        <Loading />
    )
}
export default LayOut