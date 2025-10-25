import { BadgeCent, BadgeCheck, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import ResponsiveImage from "./responsiveImage.jsx";
function StoryView({veiwStory,setveiwStory}) {
    const closeStory=()=>{
        setveiwStory(null)
    }
    const storyType=()=>{
        switch (veiwStory.media_type){
            case "image":
                return(
                    <img src={veiwStory.media_url} className='max-w-full max-h-full object-contain' alt="" />
                )
            case "video" :
              return(<video src={veiwStory.media_url} className='max-w-full max-h-full object-contain' controls autoPlay onEnded={()=>setveiwStory(null)}></video>
              )
              case "text":
                return(
                    <p className='text-white p-8 m-auto text-2xl'>
                        {veiwStory.content}
                    </p>
                )
            default :
            return null
        }
    }
    const [progress,setProgress]=useState(0)
    useEffect(()=>{
        let timer,progressInterval
        if(veiwStory&&veiwStory.media_type!=="video"){
        setProgress(0)
        const duration =10000
        const setTime=100
        let elapsed=0
        progressInterval=setInterval(()=>{
            elapsed +=setTime
            setProgress((elapsed / duration) * 100)
        },setTime)
        timer=setTimeout(()=>{
            setveiwStory(null)
        },duration)
        }
        return ()=>{
            clearTimeout(timer)
            clearInterval(progressInterval)
        }

    },[veiwStory,setveiwStory])
  return (
    <div className='flex-cent fixed w-screen top-0 left-0 z-50 bg-black h-screen' style={{
        backgroundColor:veiwStory.media_type==="text"?veiwStory.background_color:"#000000"
    }} >
      <div className='absolute top-0 left-0 z-10 h-1 bg-gray-700 w-full'>
        <div style={{width:`${progress}%`}} className='h-full bg-white transition-all duration-100 linear'>

        </div>
      </div>
      <div className='absolute z-10 top-4 flex flex-col spa-x-3 backdrop-blur-2xl bgblack/50 rounded left-4'>
      <img src={veiwStory.user?.profile_picture} className='size-7 sm:size-8 object-cover border-white border rounded-full' alt="" />
      <div className='text-white font-medium gap-1.5 m-auto flex-cent'>
        <span>{veiwStory?.user.full_name}</span>
        <BadgeCheck size={18}/>

      </div>
      </div>
      
      <button onClick={()=>closeStory()} className='absolute top-4 z-10 text-white font-bold focus:outline-none text-3xl'>
        <X size={18} className='w-8 h-8 hover:scale-110 cursor-pointer transition'/>

      </button>
      <div className='absolute top-0 flex-cent left-0 w-full h-full'>
        {storyType()}
      </div>
    </div>
  )
}
export default StoryView
