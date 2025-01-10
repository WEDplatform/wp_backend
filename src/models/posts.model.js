import { Schema } from "mongoose";
const interactionModel=new Schema({
    dateInteraction:{
        type:Date
    },
    interactionCount:{
        type:Number
    }
})
const postSchema=new Schema({
    postOwner:{
        type:Schema.Types.ObjectId,
        ref:"vendor"
    },
    imageData:[String],
    likes:[{
        type:Schema.Types.ObjectId,
        ref:"user"
    }],
    interactionHistory:[interactionModel],
    
})