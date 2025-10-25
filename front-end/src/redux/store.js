import {configureStore} from "@reduxjs/toolkit"
import userSlice from "./user/userSlice"
import connectionSlice from "./connections/connectionSlice"
import messageSlice from "./messages/messages"
export const store=configureStore({
    reducer:{
        user:userSlice.reducer,
        connections:connectionSlice,
        messages:messageSlice.reducer,
    }
})
