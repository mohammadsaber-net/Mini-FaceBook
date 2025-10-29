import {configureStore} from "@reduxjs/toolkit"
import userSlice from "./user/userSlice"
import connectionSlice from "./connections/connectionSlice"
import messageSlice from "./messages/messages"
import recentMessageSlice from "./messages/recentMessages"
import showModelsSlice from "./models/showModels"
import storySlice from "./stories/story"
export const store=configureStore({
    reducer:{
        user:userSlice.reducer,
        connections:connectionSlice,
        messages:messageSlice.reducer,
        recentMessage:recentMessageSlice.reducer,
        showModels:showModelsSlice,
        stories:storySlice.reducer
    }
})
