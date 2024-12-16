import { upload } from "../middlewares/multer.middleware.js";
import { asyncHandler, tryCatchWrapper } from "../../utils/asyncHandler.js";
import { userModel } from "../models/user.model.js";
import { ApiResponse } from "../../utils/Apiresponse.js";
import { ApiError } from "../../utils/Apierror.js";
import jwt from "jsonwebtoken"
import { accessTokenOption, refreshTokenOption } from "../constants.js";
let generateRefreshAndAccessToken=async(id)=>{
    let userFound=await userModel.findOne({_id:id})
    let refreshToken=await userFound.generateRefreshToken()
    userFound.refreshToken=refreshToken
    userFound.save({validateBeforeSave:false})
    return {refreshToken}
}
let incrementLoginCount=tryCatchWrapper(async(id)=>{
    let userFound=await userModel.findByIdAndUpdate({_id:id},{
        $inc:{loginCounts:1}
    })
})
const userRegisterHandler=tryCatchWrapper(async(req,resp)=>{
    let userExistense=await userModel.findOne({email:req.body.email})
    if(userExistense){
        resp.status(409).send(new ApiResponse(409,{
            email:userExistense.email,
            isMobileVerified:userExistense.isMobileVerified
        },"User already exists"))
        return
    }
    let userSavingInstance=await userModel.create(req.body)
    if(!userSavingInstance){
        //throw new ApiError(500,"internal server error")
        resp.status(500).send(new ApiResponse(500,null,"Internal server error"))
        return
    }

    let {refreshToken}=await generateRefreshAndAccessToken(userSavingInstance._id)
    resp.status(201)
    .send(new ApiResponse(201,{
        username:userSavingInstance.username,
        email:userSavingInstance.email,
        isMobileVerified:userSavingInstance.isMobileVerified,
        refreshToken:refreshToken
    },"User created successfully"))
    await incrementLoginCount(userSavingInstance._id)
})
const userLoginHandler=tryCatchWrapper(async(req,resp)=>{
    const {userid,password}=req.body;   
     
    let loggedUser=await userModel.findOne({
        $or:[{email:userid},{username:userid}]
    })
    
    
    if(!loggedUser){
        resp.status(404).send(new ApiResponse(404,{
            message:"no user was there"
        },"no user found"))
        return
    }
    if(loggedUser.isGoogleAuthenticated){
        
        let {refreshToken}=await generateRefreshAndAccessToken(loggedUser._id)
            resp.status(202).send(new ApiResponse(202,{
                email:loggedUser.email,
                isMobileVerified:loggedUser.isMobileVerified,
                username:loggedUser.username,
                isGoogleAuthenticated:loggedUser.isGoogleAuthenticated,
                refreshToken:refreshToken
            },"user found"))
            await incrementLoginCount(loggedUser._id)
            return
    }
    let passComp=await loggedUser.validatePassword(password)
    
    if(passComp){
        let {refreshToken}=await generateRefreshAndAccessToken(loggedUser._id)

        if(!(loggedUser.isMobileVerified)){
            resp.status(203).send(new ApiResponse(203,{
                email:loggedUser.email,
                isMobileVerified:loggedUser.isMobileVerified,
                username:loggedUser.username,
                phoneNumber:loggedUser.phoneNumber,
                refreshToken:refreshToken
            },"Mobile number not verified"))
            await incrementLoginCount(loggedUser._id)
            return
        }
        else{
            resp.status(202).send(new ApiResponse(202,{
                email:loggedUser.email,
                isMobileVerified:loggedUser.isMobileVerified,
                username:loggedUser.username,
                refreshToken:refreshToken
            },"user found"))
            await incrementLoginCount(loggedUser._id)
            return
        }
        
    }
    
    resp.status(403).send(new ApiResponse(403,null,"Authentication failed"))
    
})
let usernameAvailability=tryCatchWrapper(async(req,resp)=>{
    let username=await userModel.findOne({username:req.body.username})
    if(!username){
        resp.status(200).send(new ApiResponse(200,null,"Username available"))
        return
    }
    resp.status(409).send(new ApiResponse(409,null,"Username not available"))


})
let pseudoApi=tryCatchWrapper(async(req,resp)=>{
    resp.status(200).send(new ApiResponse(200,{message:"user authenticated"},"Pseudo api"))
})
let logoutUser=tryCatchWrapper(async(req,resp)=>{
    let userInstance=await userModel.findOneAndUpdate({_id:req.user._id},{
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
            let userFound=await userModel.findOne({_id:user._id})
            if(!userFound){
                throw new ApiError(404,"Refresh token expired or used")
            }
            let {refreshToken}=await generateRefreshAndAccessToken(userFound._id)
            resp.status(200).send(new ApiResponse(200,{
                refreshToken:refreshToken,
                username:userFound.username,
                email:userFound.email
            },"Refresh token"))
        })
})
export {userRegisterHandler,userLoginHandler,usernameAvailability,pseudoApi,logoutUser,refreshAccessToken}