import { use, useEffect, useState } from "react"
import { Plus } from "lucide-react"
import moment from "moment";
import StoryView from "./storyView.jsx";
import { useAuth } from "@clerk/clerk-react";
import ResponsiveImage from "./responsiveImage.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setShowModel } from "../redux/models/showModels.js";
import { fetchStories } from "../redux/stories/story.js";
function StoriesBar() {
    const [veiwStory,setveiwStory]=useState(null)
    const {getToken}=useAuth()
    const dispatch=useDispatch()
    const fetchstory=async()=>{
        const token=await getToken()
        dispatch(fetchStories(token))
    }
    useEffect(()=>{
        fetchstory()
    },[])
    const story=useSelector(state=>state.stories.story)
  return (
    <div className=" overflow-x-auto w-[calc(100vw-50px)] md:w-[calc(100vw-300px)] relative ">
      <div className="flex gap-4 pb-5">
         
        <div onClick={()=>setShowModel(true)} className="min-w-30
        hover:shadow-lg transition-all duration-300 hover:bg-zinc-300 border-dashed cursor-pointer border me-2 rounded-md md:rounded-lg border-indigo-600
        shadow-sm max-w-30">
            <div className="flex flex-col h-full items-center justify-center p-4">
                <div className="rounded-full flex aspect-[3/4] w-7 h-7 max-h-40 bg-indigo-500 items-center justify-center ">
                    <Plus  className="w-5 h-5 text-white"/>
                </div>
                <p className="text-sm font-medium text-slate-800 text-center">create story</p>
            </div>
        </div>
        {story?.map((st,index)=>{
        return(
            <div onClick={()=>setveiwStory(st)} key={index} className={`relative rounded-lg bg-gradient-to-r min-w-20 md:min-w-36 overflow-hidden min-h-28 md:min-h-40 p-1 me-0.5 duration-200 cursor-pointer transition-all`}>
                <img src={st.user.profile_picture} className="absolute z-10 size-8 rounded-full top-2 left-2"/>
                <p className=" truncate top-10 left-3 z-20 text-white text-xs absolute">
                    {st.content}
                </p>
                <p className="text-white absolute bottom-1 z-10 text-xs">
                    {moment(st.createdAt).fromNow()}
                </p>
                {
                    st.media_type==="text"&&(
                        <div className="absolute  w-full h-full bg-black overflow-hidden rounded-lg">
                            
                        </div>
                    )
                }
                 <div className="absolute bg-black w-full h-full rounded-lg overflow-hidden">
                    { st.media_type==="image"?<ResponsiveImage src={st.media_url} className="w-full h-full"/>
                    :<video src={st.media_url}  className="w-full h-full"/>
                 }  </div>
                   
            
            </div>
        )})}
      </div>
      {veiwStory&& <StoryView setveiwStory={setveiwStory} veiwStory={veiwStory}/>}
    </div>
  )
}

export default StoriesBar
