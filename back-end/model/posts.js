import mongoose from "mongoose";
const postsEschema=mongoose.Schema({
    user:{
        type:String,
        ref:"FaceUser",
        required:true
    },
    content:{
        type:String,
    },
    image_url:[String],
    post_type:{
        type:String,
        enum:["text","image","image_with_text"],
        required:true
    },
    likes_count:{
        type:[String],
        ref:"FaceUser"
      }
},{timestamps:true,minimize:false})
export const Post=mongoose.model("FacePost",postsEschema)