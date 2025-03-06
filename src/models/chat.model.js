import mongoose,{Schema} from "mongoose";
const payLoad=new Schema({
    text:{
        type:String
    },
    sender:{
        type:String
    },
    receiver:{
        type:String
    }
},{
    timestamps:true
})
const messSchema=new Schema({
    chatDate:{
        type:Date
    },
    payloads:[payLoad]
})
const subsctibersSchema=new Schema({
    uuid:{
        type:String,
        required:true
    },
    userId:{
        type:String
    },
    userName:{
        type:String
    },
    messages:[messSchema]
})
const chatSchema=new Schema({
    roomName:String,
    vendorId:String,
    subscribers:[subsctibersSchema]
})
const chatModel=mongoose.model('chatpen',chatSchema)
export {chatModel}