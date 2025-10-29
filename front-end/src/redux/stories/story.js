import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
export const fetchStories=createAsyncThunk("stories/fetchStories",async(token)=>{
    try {
        const {data}=await api.get("/api/story/get",{
            headers:{Authorization:`Bearer ${token}`}
        })
        return data.stories
    } catch (error) {
        throw new Error(error.message)
    }
})

const storySlice=createSlice({
    name:"stories",
    initialState:{
        story:[],
        loading:false,
        error:null
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
            .addCase(fetchStories.pending,(state)=>{
                state.loading=true
            })
            .addCase(fetchStories.fulfilled,(state,action)=>{
                state.loading=false
                state.story=action.payload
            })
            .addCase(fetchStories.rejected,(state,action)=>{
                state.loading=false
                state.error=action.payload
            })
    }
})

export const {}=storySlice.actions
export default storySlice