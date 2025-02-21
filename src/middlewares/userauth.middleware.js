import {  tryCatchWrapper } from "../../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { userModel } from "../models/user.model.js";
import { ApiError } from "../../utils/Apierror.js";
import { vendorModel } from "../models/vendor.model.js";
export const checkUserAuth=tryCatchWrapper(async(req,response,next)=>{
    let credentials=req.get("wedoraCredentials")
    
    if(!credentials){
       response.status(401).send(new ApiError(401,"Unauthorized request"))
        return
    }
    jwt.verify(credentials,process.env.JWT_SECRET,async(err,user)=>{
        if(err){
           response.status(401).send(new ApiError(401,"Auth failed get new token"))
            return
        }
        if(user?.typeClient=="user"){
            let foundUser=await userModel.findById({_id:user._id})
            if(!foundUser){
               response.status(404).send(new ApiError(404,"User not found"))
                return
            }
            if(foundUser?.refreshToken!=credentials){
                response.status(401).send(new ApiError(401,"Auth failed get new token"))
                return 
            }
            req.user=foundUser
            next()
        } 
        if(user?.typeClient=="vendor"){
            let foundVendor=await vendorModel.findById({_id:user._id})
            if(!foundVendor){
               response.status(404).send(new ApiError(404,"Vendor not found"))
                return
            }
            if(foundVendor?.refreshToken!=credentials){
                response.status(401).send(new ApiError(401,"Auth failed get new token"))
                return
            }
            req.user=foundVendor
            next()
        } 
    })
})
