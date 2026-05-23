import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios.js";
import axios from "axios";
export const fetchConnections=createAsyncThunk(
"connections/fetchConnections",
async(token,{rejectWithValue})=>{

    try {

        console.log("token =>", token)

        const response = await axios.get(
            "http://localhost:3000/api/connection/connections",
            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
        )

        console.log("response=>",response.data)

        return response.data

    } catch(error) {

        console.log("STATUS:",error.response?.status)
        console.log("DATA:",error.response?.data)

        return rejectWithValue(
            error.response?.data || error.message
        )
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