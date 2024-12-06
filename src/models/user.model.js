import mongoose, { Schema } from "mongoose";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
const userSchema=new Schema({
    username:{
        type:String,
        min:[3,'Username must be at least 3 characters long'],
        index:true,
        lowercase:true,
        unique:true
    },
    password:{
        type:String,
        min:[6,'Password must be at least 6 characters long'],
        required:[true,'Password is required']
    }
},{
    timestamps:true
})
userSchema.pre("save",function(next){
    if(!this.isModified('password')) return next()
    bcryptjs.genSalt(10,function(err,salt){
        if(err) throw err;
        bcryptjs.hash(this.password,salt,function(err,hash){
            if(err) throw err;
            this.password=hash
            next()
        })
    })
})
userSchema.methods.validatePassword=async function(password){
    return await bcryptjs.compare(password,this.password)
}
userSchema.methods.generateRefreshToken= function(){
    return jwt.sign(
        {
            _id: this._id,
            username: this.username
        }, process.env.JWT_SECRET,{
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        },
         { algorithm: 'RS256' });
}
userSchema.methods.generateAccessToken= function(){
    return jwt.sign(
        {
            _id: this._id,
            username: this.username
        }, process.env.JWT_SECRET,{
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        },
         { algorithm: 'RS256' });
}
const userModel=mongoose.model('User',userSchema)