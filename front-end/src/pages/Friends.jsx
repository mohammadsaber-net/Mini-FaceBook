import { Eye, MessageSquare } from "lucide-react"
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function Friends() {
    const connection=useSelector(state=>state.connections.connections)
    const navigate=useNavigate()
  return (
    <div className="mt-14 sm:mt-6">
        <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">
                        Friends
                    </h1>
                </div>
      <div>
                    <h3 className="md:text-lg text-base font-semibold text-slate-800">Friends</h3>
                    <div className="flex flex-col gap-3">
                    {
                        connection.map((user,index)=>(
                            <div key={user._id} className="max-w-xl flex flex-wrap gap-5 p-1 text-xs ms:text-base sm:p-6
                             bg-white shadow rounded-md">
                                <img src={user.profile_picture} className="rounded-full mx-auto size-12" alt="" />
                                <div className="flex-1 ">
                                    <p className="font-medium text-slate-700 ">
                                        {user.full_name}
                                    </p>
                                    <p className="text-slate-500">@{user.username}</p>
                                    <p className="text-sm text-gray-600">
                                        {user.bio}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 mt-4">
                                    <button onClick={()=>navigate(`/messages/${user._id}`)} className="size-10 flex-cent text-sm rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-95 transition-all duration-300 cursor-pointer gap-1 ">
                                        <MessageSquare className="size-4"/>
                                    </button>
                                    <button onClick={()=>navigate(`/profile/${user._id}`)}  className="size-10 flex-cent text-sm rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-95 transition-all duration-300 cursor-pointer">
                                        <Eye />
                                    </button>
                                </div>
                             </div>
                        ))
                    }
                </div>
                </div>
    </div>
  )
}
