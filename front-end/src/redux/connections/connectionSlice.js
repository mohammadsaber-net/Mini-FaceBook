import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios.js";

export const fetchConnections=createAsyncThunk("connections/fetchConnections",async(token)=>{
    try {
        const {data}=await api.get("/api/connection/connections",{
            headers:{Authorization:token}
        })
        return data.success?data:null
    } catch (error) {
        return (error.message)
    }
})
const connectionSlice=createSlice({
    name:"connections",
    initialState:{
        connections:[],
        pendingConnections:[],
        followers:[],
        following:[]
    },
    extraReducers:(building)=>{
        building.addCase(fetchConnections.fulfilled,(state,action)=>{
            state.connections=action.payload.connections
            state.pendingConnections=action.payload.pendingConnections
            state.followers=action.payload.followers
            state.following=action.payload.following
        })
    }
})
export default connectionSlice.reducer