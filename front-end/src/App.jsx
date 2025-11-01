import {Route , Routes, useLocation } from "react-router-dom"
import Feed from "./pages/Feed"
import Login from "./pages/Login"
import CreatePosts from "./pages/CreatePost"
import Discover from "./pages/Discover"
import LayOut from "./pages/LayOut"
import Profile from "./pages/Profile"
import { useUser,useAuth } from "@clerk/clerk-react"
import Connection from "./pages/Connection"
import {Toaster} from "react-hot-toast"
import ChatBox from "./pages/ChatPox"
import { useEffect, useRef } from "react"
import {useDispatch} from "react-redux"
import { fetchUser } from "./redux/user/userSlice"
import { fetchConnections } from "./redux/connections/connectionSlice"
import Message from "./pages/Message"
import { addMessages } from "./redux/messages/messages"
import Sponsore from "./components/sponsore"
import OnePost from "./components/onePost"
import RecentMessage from "./components/RecentMessage"
import SignUpPage from "./pages/sign-up"

function App() {
  const {user}=useUser() 
  const {getToken}= useAuth()
  const {pathname}=useLocation()
  const phathnameRef=useRef(pathname)
  const dispatch=useDispatch()
  useEffect(()=>{
    const fetchData=async()=>{
      if(user){
      const token=await getToken()
      dispatch(fetchUser(token))
      dispatch(fetchConnections(token))
    }
    }
    fetchData()
  },[user,getToken,dispatch])
  useEffect(()=>{
    phathnameRef.current=pathname
  },[pathname])
  useEffect(()=>{
    if(user){
      const eventSource=new EventSource(import.meta.env.VITE_BASE_URL + "/api/message/" + user.id)
      eventSource.onmessage=(event)=>{
        const message=JSON.parse(event.data)
        if(pathname.current===("/messages/"+message.from_user_id)){
          dispatch(addMessages(message))
        }else{

        }
      }
      return ()=>{
        eventSource.close()
      }
    }
  },[user,dispatch])
  return (
    <>
    <Toaster />
    <Routes>
      <Route path="/sign-up" element={<SignUpPage />} />

    <Route path="/" element={!user?<Login />:<LayOut />}>
      <Route index element={<Feed />}/>
      <Route path="/messages" element={<Message />}/>
      <Route path="/messages/:userId" element={<ChatBox />}/>
      <Route path="/connections" element={<Connection />}/>
      <Route path="/recentmessage" element={<RecentMessage />}/>
      <Route path="/sponsore" element={<Sponsore />}/>
      <Route path="/createPost" element={<CreatePosts />}/>
      <Route path="/discover" element={<Discover />}/>
      <Route path="/post/:postId" element={<OnePost />}/>
      <Route path="/profile" element={<Profile />}/>
      <Route path="/profile/:profileId" element={<Profile />}/>
    </Route>
    </Routes>
    </>
  )
}

export default App
