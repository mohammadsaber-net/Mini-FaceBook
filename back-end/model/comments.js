import mongoose from "mongoose";
const commentsSchema = mongoose.Schema({
    post: {
        type: String,
        ref: "FacePost",
        required: true
    },
    user: {
        type: String,
        ref: "FaceUser",
        required: true
    },
    type_comment: {
        type: String,
        enum: ["text", "image", "image_with_text"],
        required: true
    },
    image_url: {
        type: [String],
        default: []
    },
    content: {
        type: String,
        required: true
    },
    likes_count: {
        type: [String],
        ref: "FaceUser"
    }
}, { timestamps: true, minimize: false });
export const Comment = mongoose.model("FaceComment", commentsSchema);