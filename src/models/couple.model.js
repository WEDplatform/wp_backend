import mongoose,{ Schema } from "mongoose";
const coupleSchema=new Schema({
    coupleName:{
        type:String
    },
    couplecover:{
        type:[String]
    },
    name:{
        type:String
    }
})
const coupleModel = mongoose.model('couple',coupleSchema)