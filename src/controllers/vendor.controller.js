import { upload } from "../middlewares/multer.middleware.js";
import { asyncHandler, tryCatchWrapper } from "../../utils/asyncHandler.js";
import { vendorModel } from "../models/vendor.model.js";
import { ApiResponse } from "../../utils/Apiresponse.js";
import { ApiError } from "../../utils/Apierror.js";
import jwt from "jsonwebtoken"
import fs from "fs"

import { accessTokenOption, refreshTokenOption } from "../constants.js";
let generateRefreshAndAccessToken=async(id)=>{
    let userFound=await vendorModel.findOne({_id:id})
    let refreshToken=await userFound.generateRefreshToken()
    userFound.refreshToken=refreshToken
    userFound.save({validateBeforeSave:false})
    return {refreshToken}
}
let incrementLoginCount=tryCatchWrapper(async(id)=>{
    const currentDate = new Date().toISOString().split('T')[0];
    
    let userFound=await vendorModel.findOne({_id:id,
        loginCounts:{
           $elemMatch:{dateLogin:currentDate} 
        }
    })
    if(!userFound){
        let updatedUser=await vendorModel.findOneAndUpdate({_id:id},{
            $push:{loginCounts:{dateLogin:currentDate,loginCount:1}}
        },{
            new:true
        })
        userFound=updatedUser
    }else{
        let updatedUser=await vendorModel.findOneAndUpdate({_id:id,"loginCounts.dateLogin":currentDate},{
            $inc:{'loginCounts.$.loginCount':1}
        },{
            new:true
        })
        userFound=updatedUser
    }
    //console.log(userFound);
})
const vendorRegisterHandler=tryCatchWrapper(async(req,resp)=>{
    let userExistense=await vendorModel.findOne({businessEmail:req.body.businessEmail})
    if(userExistense){
        resp.status(409).send(new ApiResponse(409,{
            email:userExistense.businessEmail,
            isMobileVerified:userExistense.isMobileVerified
        },"User already exists"))
        return
    }
    let userSavingInstance=await vendorModel.create(req.body)
    if(!userSavingInstance){
        //throw new ApiError(500,"internal server error")
        resp.status(500).send(new ApiResponse(500,null,"Internal server error"))
        return
    }
    let {refreshToken}=await generateRefreshAndAccessToken(userSavingInstance._id)
    resp.status(201)
    .send(new ApiResponse(201,{
        businessName:userSavingInstance.businessName,
        businessEmail:userSavingInstance.businessEmail,
        isMobileVerified:userSavingInstance.isMobileVerified,
        refreshToken:refreshToken
    },"User created successfully"))
    await incrementLoginCount(userSavingInstance._id)
})
const vendorLoginHandler=tryCatchWrapper(async(req,resp)=>{
    const {userid,password}=req.body;   
     
    let loggedUser=await vendorModel.findOne({
        $or:[{businessEmail:userid},{businessName:userid}]
    })
    if(!loggedUser){
        resp.status(404).send(new ApiResponse(404,{
            message:"no user was there"
        },"no user found"))
        return
    }
    // if(loggedUser.isGoogleAuthenticated){
        
    //     let {refreshToken}=await generateRefreshAndAccessToken(loggedUser._id)
    //         resp.status(202).send(new ApiResponse(202,{
    //             email:loggedUser.email,
    //             isMobileVerified:loggedUser.isMobileVerified,
    //             username:loggedUser.username,
    //             isGoogleAuthenticated:loggedUser.isGoogleAuthenticated,
    //             refreshToken:refreshToken
    //         },"user found"))
    //         await incrementLoginCount(loggedUser._id)
    //         return
    // }
    let passComp=await loggedUser.validatePassword(password)
    
    if(passComp){
        let {refreshToken}=await generateRefreshAndAccessToken(loggedUser._id)
        if(!(loggedUser.isMobileVerified)){
            resp.status(203).send(new ApiResponse(203,{
                email:loggedUser.businessEmail,
                isMobileVerified:loggedUser.isMobileVerified,
                username:loggedUser.businessName,
                phoneNumber:loggedUser.businessPhone,
                refreshToken:refreshToken
            },"Mobile number not verified"))
            await incrementLoginCount(loggedUser._id)
            return
        }
        else{
            resp.status(202).send(new ApiResponse(202,{
                email:loggedUser.businessEmail,
                isMobileVerified:loggedUser.isMobileVerified,
                username:loggedUser.businessName,
                refreshToken:refreshToken
            },"user found"))
            await incrementLoginCount(loggedUser._id)
            return
        }
        
    }
    
    resp.status(403).send(new ApiResponse(403,null,"Authentication failed"))   
})
let vendorUsernameAvailability=tryCatchWrapper(async(req,resp)=>{
    let username=await vendorModel.findOne({username:req.body.businessName})
    if(!username){
        resp.status(200).send(new ApiResponse(200,null,"Username available"))
        return
    }
    resp.status(409).send(new ApiResponse(409,null,"Username not available"))
})
let pseudoApi=tryCatchWrapper(async(req,resp)=>{
    resp.status(200).send(new ApiResponse(200,{message:"user authenticated"},"Pseudo api"))
})
let logoutVendor=tryCatchWrapper(async(req,resp)=>{
    let userInstance=await vendorModel.findOneAndUpdate({_id:req.user._id},{
        $set:{
            refreshToken:undefined
        }
    },
    {
        new:true
    })
    if(!userInstance){
        resp.status(404).send(new ApiResponse(404,null,"User not found"))
        return
    }
    resp.status(200).send(new ApiResponse(200,userInstance,"Logout successful"))
})
const refreshAccessToken=tryCatchWrapper(async(req,resp)=>{
        let incomingRefreshToken=req.body.refreshToken
        if(!incomingRefreshToken){
            throw new ApiError(401,"Unauthorized request")
        }
        jwt.verify(incomingRefreshToken,process.env.JWT_SECRET,async(err,user)=>{
            if(err){
                throw new ApiError(401,"unable to verify refreshToken")
            }
            let userFound=await vendorModel.findOne({_id:user._id})
            if(!userFound){
                throw new ApiError(404,"Refresh token expired or used")
            }
            let {refreshToken}=await generateRefreshAndAccessToken(userFound._id)
            resp.status(200).send(new ApiResponse(200,{
                refreshToken:refreshToken,
                username:userFound.businessName,
                email:userFound.businessEmail
            },"Refresh token"))
        })
})
const populateVendor=tryCatchWrapper(async(req,resp)=>{
     const vendors=fs.readFileSync('utils/vendorlist1.json')
    Promise.all(JSON.parse(vendors).map(async(user)=>{
        return await vendorModel.create(user)
    }))
    resp.status(200).send(new ApiResponse(200,null,"Vendors populated"))
})
export {vendorRegisterHandler,
    vendorLoginHandler,
    vendorUsernameAvailability,
    pseudoApi,logoutVendor,refreshAccessToken,populateVendor}