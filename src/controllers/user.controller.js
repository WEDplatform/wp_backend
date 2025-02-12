import { upload } from "../middlewares/multer.middleware.js";
import { asyncHandler, tryCatchWrapper } from "../../utils/asyncHandler.js";
import { userModel } from "../models/user.model.js";
import { ApiResponse } from "../../utils/Apiresponse.js";
import { ApiError } from "../../utils/Apierror.js";
import jwt from "jsonwebtoken"
import fs from "fs"
import { accessTokenOption, refreshTokenOption } from "../constants.js";
let generateRefreshAndAccessToken=async(id)=>{
    let userFound=await userModel.findOne({_id:id})
    let refreshToken=await userFound.generateRefreshToken()
    userFound.refreshToken=refreshToken
    userFound.save({validateBeforeSave:false})
    return {refreshToken}
}
let incrementLoginCount=tryCatchWrapper(async(id)=>{
    const currentDate = new Date().toISOString().split('T')[0];
    // let userFound=await userModel.findByIdAndUpdate({_id:id},{
    //     $inc:{loginCounts:1}
    // })
    let userFound=await userModel.findOne({_id:id,
        loginCounts:{
           $elemMatch:{dateLogin:currentDate} 
        }
    })
    if(!userFound){
        let updatedUser=await userModel.findOneAndUpdate({_id:id},{
            $push:{loginCounts:{dateLogin:currentDate,loginCount:1}}
        },{
            new:true
        })
        userFound=updatedUser
    }else{
        let updatedUser=await userModel.findOneAndUpdate({_id:id,"loginCounts.dateLogin":currentDate},{
            $inc:{'loginCounts.$.loginCount':1}
        },{
            new:true
        })
        userFound=updatedUser
    }
})
const userRegisterHandler=tryCatchWrapper(async(req,resp)=>{
    let userExistense=await userModel.findOne({email:req.body.email})
    if(userExistense){
        resp.status(409).send(new ApiResponse(409,{
            email:userExistense.email,
            isMobileVerified:userExistense.isMobileVerified,
            isPreferencesSet:userExistense.isPreferencesSet
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
        refreshToken:refreshToken,
        isPreferencesSet:userSavingInstance.isPreferencesSet
    },"User created successfully"))
    await incrementLoginCount(userSavingInstance._id)
})
const updateUserPreferences=tryCatchWrapper(async(req,resp)=>{
    let updatedUserInstance=await userModel.findOneAndUpdate({
        email:req.body.email
    },{
        $set:{
            locationCity:req.body.locationCity,
        },
        $push:{
            userPreference:{
                $each:req.body.userPreference
            }
        }
    },{
        new:true
    })
    if(!updatedUserInstance){
        resp.status(404).send(new ApiResponse(404,null,"Unable to update preferences can do it later"))
        return
    }
    resp.status(200).send(new ApiResponse(200,updatedUserInstance,"Preferences updated"))
})
const userLoginHandler=tryCatchWrapper(async(req,resp)=>{
    const {userid,password}=req.body;   
    const currentDate = new Date().toISOString().split('T')[0];
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
            resp.status(203).send(new ApiResponse(203,{
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
// creating a function just for populating user
const populateUser=tryCatchWrapper(async(req,resp)=>{
    const users=fs.readFileSync('utils/50_indian_users.json')
    const creationResponse=Promise.all(JSON.parse(users).map(async(user)=>{
        return await userModel.create(user)
    }))
    resp.status(200).send(new ApiResponse(200,creationResponse,"Users populated"))        
})
export {userRegisterHandler,
    userLoginHandler,
    usernameAvailability,
    pseudoApi,
    logoutUser,
    refreshAccessToken,
    updateUserPreferences,
populateUser}