import {  tryCatchWrapper } from "../../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { ApiResponse } from "../../utils/Apiresponse.js";
import { userModel } from "../models/user.model.js";
export const checkUserAuth=tryCatchWrapper(async(req,response,next)=>{
    let credentials=req.get("wedoraCredentials")
    if(!credentials){
        response.status(401).send(new ApiResponse(401,null,"Unauthorized request"))
        return
    }
    jwt.verify(credentials,process.env.JWT_SECRET,async(err,user)=>{
        if(err){
            response.status(401).send(new ApiResponse(401,null,"Unauthorized request get new token"))
            return
        }
        let foundUser=await userModel.findById({_id:user._id})
        if(!foundUser){
            response.status(404).send(new ApiResponse(404,null,"Unable to fetchuser"))
            return
        }
        req.user=foundUser
        next()
    })
})