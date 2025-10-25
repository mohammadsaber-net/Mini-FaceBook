import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios.js";
import toast from "react-hot-toast"
const initialState={
    user:null,
    loading:false
}
export const fetchUser=createAsyncThunk("user/fetchUser",async(token)=>{
        const {data}=await api.get("/api/user/data",{
        headers:{Authorization:`Bearer ${token}`}
        })
        return data.success?data.value:null
}) 
export const updateUser=createAsyncThunk("user/updateUser",async({userData,token})=>{
    const {data}=await api.patch("/api/user/update",userData,{
        headers:{Authorization:`Bearer ${token}`},
    })
    if(data.success){
        console.log(data.message)
        toast.success(data.message)
        return data.value 
    }else{
       toast.error(data.message) 
       return null
    }
}) 
const userSlice=createSlice({
    initialState,
    name:"user",
    reducers:{

    },
    extraReducers:(builder)=>{
        builder.addCase(fetchUser.fulfilled,(state,action)=>{
            state.user=action.payload
            state.loading=false
        })
        builder.addCase(updateUser.fulfilled,(state,action)=>{
            state.user=action.payload
            state.loading=false
        })
        builder.addCase(fetchUser.pending,(state,action)=>{
            state.loading=true
        })
        builder.addCase(updateUser.pending,(state,action)=>{
            state.loading=true
        })
    }
})
export default userSlice