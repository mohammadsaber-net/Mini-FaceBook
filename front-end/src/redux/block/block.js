import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";
import toast from "react-hot-toast";
export const fetchBlock=createAsyncThunk("fetchBlock/blockSlice",async({blockedId,token})=>{
    try{
    const {data}=await api.post("/api/user/block",{blockedId},{
            headers:{Authorization:`Bearer ${token}`}
          })
          if(data.success){
            toast.success(data.message)
            console.log(data.message)
            return data.block
          }else{
            toast.error(data.message)
          }
        } catch (error) {
          toast.error(error.message) 
    }
})
const blockSlice=createSlice({
  name:"blockSlice",
  initialState:{
    block:[]
  },
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(fetchBlock.fulfilled,(state,action)=>{
            state.block=action.payload
        })
    }
})
export default blockSlice