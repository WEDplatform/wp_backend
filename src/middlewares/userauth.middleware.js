import {  tryCatchWrapper } from "../../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { ApiResponse } from "../../utils/Apiresponse.js";
import { userModel } from "../models/user.model.js";
import { ApiError } from "../../utils/Apierror.js";
export const checkUserAuth=tryCatchWrapper(async(req,response,next)=>{
    let credentials=req.get("wedoraCredentials")
    
    if(!credentials){
        throw new ApiError(400,"bad request")
        return
    }
    jwt.verify(credentials,process.env.JWT_SECRET,async(err,user)=>{
        if(err){
            console.log(err);
            throw new ApiError(400,"Unable to verify credentials")
            return
        }
        let foundUser=await userModel.findById({_id:user._id})
        if(!foundUser){
            throw new ApiError(404,"User not found")
            return
        }
        req.user=foundUser
        next()
    })
})