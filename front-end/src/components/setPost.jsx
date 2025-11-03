import { ImagePlay} from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { setShowPost } from "../redux/models/showModels"
import { Link } from "react-router-dom"

export default function SetPost() {
    const user=useSelector(state=>state.user?.user)
    const dispatch=useDispatch()
  return (
    <div className='shadow-md bg-white p-2 w-[95%] sm:w-4/5 md:w-3/5 lg:w-1/2 xl:w-2/5 mb-4 mt-8 sm:mt-4 m-auto rounded-xl'>

     
      <div className='sm:border-b sm:border-gray-300 cursor-pointer flex gap-2'>
        <div onClick={()=>dispatch(setShowPost(true))} className='bg-gray-100 mb-4 sm:px-4 p-2 w-full text-gray-500 rounded-full'>
            what is your thoughts ? 
        </div>
        <Link to={`/profile/${user._id}`} className="border cursor-pointer rounded-full overflow-hidden border-gray-500 w-12 h-10">
            <img src={user.profile_picture} className="z-10" alt="" />
        </Link>
      </div>
       <div className="flex items-center justify-center gap-2">
        <div onClick={()=>dispatch(setShowPost(true))} className="flex justify-between items-center gap-2 mt-2 p-1 sm:px-4 rounded-md cursor-pointer hover:bg-gray-200 transition">
            <span className="">Image</span> <ImagePlay className="text-green-600"/>
        </div>
      </div>
    </div>
  )
}
