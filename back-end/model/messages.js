import mongoose from "mongoose";
const messagesEschema=mongoose.Schema({
    from_user_id:{
        type:String,
        ref:"FaceUser",
        required:true
    },
    to_user_id:{
        type:String,
        ref:"FaceUser",
        required:true
    },
    text:{
        type:String,
        trim:true
    },
    message_type:{
        type:String,
        enum:["text","image"]
    },
    media_url:{
        type:String
    },
    seen:{
        type:Boolean,
        default:false
    }
},{timestamps:true,minimize:false})
export const Message=mongoose.model("Message",messagesEschema)