import mongoose, { Schema } from "mongoose";
const userSchema=new Schema({
    username:{
        type:String,
        unique:true,
        index:true
    }.trim().lowercase(),
    email:{
        type:String,
        unique:true,
        required:true
    }.trim().lowercase(),
    fullname:{
        type:String,
        trim:true,
    }.trim().lowercase(),
    password:{
        type:String,
    }.trim()
},{
    timestamps:true
})
const userModel=mongoose.model('user',userSchema)