import { Schema } from "mongoose";
const postSchema=new Schema({
    postOwner:{
        type:Schema.Types.ObjectId,
        ref:"vendor"
    },
    imageData:[String],
    likes:[{
        type:Schema.Types.ObjectId,
        ref:"user"
    }]
})