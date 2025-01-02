import mongoose, { mongo, Schema } from "mongoose";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
const loginStats=new Schema({
    dateLogin:{
        type:Date
    },
    loginCount:{
        type:Number
    }
})
const vendorSchema=new Schema({
    businessName:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },
    businessEmail:{
        type:String,
        required:true,
        lowercase:true,
        trim:true
    },
    businessPhone:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    city:{
        type:String,
        required:true,
        trim:true
    },
    address:{
        type:String,
        trim:true
    },
    gstNumber:{
        type:String,
        trim:true
    },
    usertype:{
        type:String,
        default:"vendor"
    },
    citiesActive:{
        type:[String],
        default:[]
    },
    servicesProvided:{
        type:[String],
        default:[]
    },
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
},{
    timestamps:true
})
vendorSchema.pre("save",function(next){
    if(!this.isModified('password')) return next()
        let salt = bcryptjs.genSaltSync(10);
        this.password=bcryptjs.hashSync(this.password,salt)
        next()

})
vendorSchema.methods.validatePassword=async function(password){
    return await bcryptjs.compare(password,this.password)
}
vendorSchema.methods.generateRefreshToken= function(){
    return jwt.sign(
        {
            _id: this._id,
            username: this.businessName,
            typeClient:"vendor"
        }, process.env.JWT_SECRET,{
            expiresIn: 3600
        });
}
const vendorModel=mongoose.model('vendor',vendorSchema)
export {vendorModel}