import mongoose from "mongoose";
const FaceUserSchema=new mongoose.Schema({
    _id:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    full_name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        unique:true
    },
    bio:{
        type:String,
        default:"Hi there, i'm using miniFacebook"
    },
    profile_picture:{
        type:String,
        default:""
    },
    cover_photo:{
        type:String,
        default:""
    },
    location:{
        type:String,
        default:""
    },
    followers:[{
        type:String,
        ref:"FaceUser"
    }],
    following:[{
        type:String,
        ref:"FaceUser"
    }],
    blocked:[{
        type:String,
        ref:"FaceUser"
    }],
    connections:[{
        type:String,
        ref:"FaceUser"
    }],
    
},{timestamps:true,minimize:false})
export const FaceUser=mongoose.model("FaceUser",FaceUserSchema)
