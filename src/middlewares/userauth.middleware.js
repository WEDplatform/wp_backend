import {  tryCatchWrapper } from "../../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { userModel } from "../models/user.model.js";
import { ApiError } from "../../utils/Apierror.js";
export const checkUserAuth=tryCatchWrapper(async(req,response,next)=>{
    let credentials=req.get("wedoraCredentials")
    
    if(!credentials){
       response.status(401).send(new ApiError(401,"Unauthorized request"))
        return
    }
    jwt.verify(credentials,process.env.JWT_SECRET,async(err,user)=>{
        if(err){
            console.log(err);
           response.status(401).send(new ApiError(401,"Auth failed get new token"))
            return
        }
        let foundUser=await userModel.findById({_id:user._id})
        if(!foundUser){
           response.status(404).send(new ApiError(404,"User not found"))
            return
        }
        req.user=foundUser
        next()
    })
})