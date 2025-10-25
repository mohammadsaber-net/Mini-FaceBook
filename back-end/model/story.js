import mongoose from "mongoose";
const storyEschema=mongoose.Schema({
    user:{
        type:String,
        ref:"FaceUser",
        required:true
    },
    content:{
        type:String,
    },
    media_url:{
        type:String,
    },
    media_type:{
        type:String,
        enum:["text","image","video"],
        required:true
    },
    views_count:{
        type:Number,
        ref:"FaceUser",
        default:0
    },
      background_color: {
        type:String,
        required:true
    },
    media:{
        type:String
    }
},{timestamps:true,minimize:false})
export const Story=mongoose.model("FaceStory", storyEschema)