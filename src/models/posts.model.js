import { Schema } from "mongoose";
const postSchema=new Schema({
    postOwner:{
        type:Schema.Types.ObjectId,
        ref:"vendor"
    },
    title:{
        type:String,
        required:true
    }
})