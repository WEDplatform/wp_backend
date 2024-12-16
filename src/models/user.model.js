import mongoose, { Schema } from "mongoose";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
const userPreferenceSchema=new Schema({
    title:{
        type:String
    },
    value:[String]
})
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
        min:[8,'Password must be at least 6 characters long']
    },
    email:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:[true,'Phone number is required'],
        length:12,
    },
    usertype:{
        type:String,
        default:"user"
    },
    isGoogleAuthenticated:{
        type:Boolean,
        default:false
    },
    locationCity:{
        type:String,
        required:[true,"Provide city name"]
    },
    userPreference:[userPreferenceSchema],
    isMobileVerified:{
        type:Boolean,
        default:false
    },
    refreshToken:{
        type:String
    },
    loginCounts:{
        type:Number,
        default:0
    }
},{
    timestamps:true
})
userSchema.pre("save",function(next){
    if(!this.isModified('password')) return next()
        let salt = bcryptjs.genSaltSync(10);
        this.password=bcryptjs.hashSync(this.password,salt)
        next()

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
            expiresIn: 3600
        });
}
userSchema.methods.generateAccessToken= function(){
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email
        }, process.env.JWT_SECRET,{
            expiresIn: 60,
        });
}
const userModel=mongoose.model('User',userSchema)
export {userModel}