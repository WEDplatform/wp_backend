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
    const {email,password}=req.body;
    let loggedUser=await userModel.findOne({email:email})
    if(!loggedUser){
        resp.status(404).send(new ApiResponse(404,null,"no user found"))
        return
    }
    let passComp=await loggedUser.validatePassword(password)
    console.log(passComp);
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
            const options={
                httpOnly:true,
                secure:true
            }
            resp.status(202).send(new ApiResponse(202,{
                email:loggedUser.email,
                isMobileVerified:loggedUser.isMobileVerified,
                username:loggedUser.username
            },"user found"))
            return
        }
    }
    
    resp.status(403).send(new ApiResponse(403,null,"invalid credentials"))
    
})
export {userRegisterHandler,userLoginHandler}