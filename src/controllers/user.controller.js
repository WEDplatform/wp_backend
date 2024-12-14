import { upload } from "../middlewares/multer.middleware.js";
import { asyncHandler, tryCatchWrapper } from "../../utils/asyncHandler.js";
import { userModel } from "../models/user.model.js";
import { ApiResponse } from "../../utils/Apiresponse.js";
import { ApiError } from "../../utils/Apierror.js";
import { accessTokenOption, refreshTokenOption } from "../constants.js";
let generateRefreshAndAccessToken=async(id)=>{
    let userFound=await userModel.findOne({_id:id})
    let accessToken=await userFound.generateAccessToken()
    let refreshToken=await userFound.generateRefreshToken()
    userFound.refreshToken=refreshToken
    userFound.save({validateBeforeSave:false})
    return {accessToken,refreshToken}
    
}
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
    console.log(userSavingInstance);
    if(!userSavingInstance){
        //throw new ApiError(500,"internal server error")
        resp.status(500).send(new ApiResponse(500,null,"Internal server error"))
        return
    }

    let {accessToken,refreshToken}=await generateRefreshAndAccessToken(userSavingInstance._id)
    resp.status(201)
    .cookie("refreshToken",refreshToken,refreshTokenOption)
    .cookie("accessToken",accessToken,accessTokenOption)
    .send(new ApiResponse(201,{
        username:userSavingInstance.username,
        email:userSavingInstance.email,
        isMobileVerified:userSavingInstance.isMobileVerified
    },"User created successfully"))
})
const userLoginHandler=tryCatchWrapper(async(req,resp)=>{
    console.log(req.body);
    const {userid,password}=req.body;   
     
    let loggedUser=await userModel.findOne({email:userid})
    
    
    if(!loggedUser){
        resp.status(404).send(new ApiResponse(404,{
            message:"no user was there"
        },"no user found"))
        return
    }
    if(loggedUser.isGoogleAuthenticated){
        
        let {accessToken,refreshToken}=await generateRefreshAndAccessToken(loggedUser._id)
            resp.status(202)
            // .cookie("refreshToken",refreshToken,refreshTokenOption)
            // .cookie("accessToken",accessToken,accessTokenOption)
            .send(new ApiResponse(202,{
                email:loggedUser.email,
                isMobileVerified:loggedUser.isMobileVerified,
                username:loggedUser.username,
                isGoogleAuthenticated:loggedUser.isGoogleAuthenticated,
                refreshToken:refreshToken,
                accessToken:accessToken
            },"user found"))
            return
    }
    let passComp=await loggedUser.validatePassword(password)
    if(passComp){
        if(!(loggedUser.isMobileVerified)){
            resp.status(401).send(new ApiResponse(401,{
                email:loggedUser.email,
                isMobileVerified:loggedUser.isMobileVerified,
                username:loggedUser.username,
                phoneNumber:loggedUser.phoneNumber
            },"Mobile number not verified"))
            return
        }
        else{
            let {accessToken,refreshToken}=await generateRefreshAndAccessToken(loggedUser._id)
            resp.status(202)
            .cookie("refreshToken",refreshToken,refreshTokenOption)
            .cookie("accessToken",accessToken,accessTokenOption)
            .send(new ApiResponse(202,{
                email:loggedUser.email,
                isMobileVerified:loggedUser.isMobileVerified,
                username:loggedUser.username
            },"user found"))
            return
        }
    }
    
    resp.status(403).send(new ApiResponse(403,null,"invalid credentials"))
    
})
let usernameAvailability=tryCatchWrapper(async(req,resp)=>{
    let userName=await userModel.findOne({username:req.body.username})
    if(userName){
        resp.status(226).send(new ApiResponse(226,null,"username already taken")) 
        return
    }
    resp.status(200).send(new ApiResponse(200,null,"username available"))


})
export {userRegisterHandler,userLoginHandler,usernameAvailability}