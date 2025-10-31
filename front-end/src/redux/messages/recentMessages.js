import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";
import toast from "react-hot-toast";
const initialState={
    messages:[]
}
export const fetchRecentMessages=createAsyncThunk("fetchRecentMessages/messages",async(token)=>{
    try{
    const {data}=await api.get("/api/message/messages",{
            headers:{Authorization:`Bearer ${token}`}
          })
          if(data.success){
            const groupedMessage=data.messages.reduce((acc,message)=>{
              const senderId=message.from_user_id._id
              if(!acc[senderId]|| new Date(message.createdAt) > new Date ((acc[senderId].createdAt))){
                acc[senderId]=message
              }
              return acc
            },{})
            const sortedMessage=Object.values(groupedMessage).sort((a,b)=>{
              new Date(b.createdAt) - new Date(a.createdAt)
            })
            return sortedMessage
          }else{
            toast.error(data.message)
          }
        } catch (error) {
          toast.error(error.message) 
        }
})
const recentMessageSlice=createSlice({
  name:"messages",
  initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(fetchRecentMessages.fulfilled,(state,action)=>{
            state.messages=action.payload
        })
        .addCase(fetchRecentMessages.rejected,(state,action)=>{
            state.messages=action.payload
        })
    }
})
export default recentMessageSlice