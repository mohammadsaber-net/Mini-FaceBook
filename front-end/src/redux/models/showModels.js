import { createSlice } from "@reduxjs/toolkit";
const showModelsSlice=createSlice({
    initialState:{
        post:false,
        story:false,
    },
    name:"showModelsSlice",
    reducers:{
        setShowModel:(state,action)=>{
            state.story=action.payload
        },
        setShowPost:(state,action)=>{
            state.post=action.payload
        }
    }
})
export const {setShowModel,setShowPost}=showModelsSlice.actions
export default showModelsSlice.reducer