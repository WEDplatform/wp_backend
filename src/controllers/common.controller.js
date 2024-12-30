import { tryCatchWrapper } from "../../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { userModel } from "../models/user.model.js";
import { vendorModel } from "../models/vendor.model.js";
import { ApiError } from "../../utils/Apierror.js";
import { ApiResponse } from "../../utils/Apiresponse.js";
export const checkClientAuth=tryCatchWrapper(async(req,response)=>{
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
        //console.log(user);
        
        response.status(200).send(new ApiResponse(200,user,"user authenticated"))
        
        // let foundUser=await userModel.findById({_id:user._id})
        // if(!foundUser){
        //    response.status(404).send(new ApiError(404,"User not found"))
        //     return
        // }
        // req.user=foundUser
        
    })
})
export const logout=tryCatchWrapper(async(req,resp)=>{
    console.log(req?.user);
    if(req?.user?.usertype=="user"){
        let userInstance=await userModel.findOneAndUpdate({_id:req.user._id},{
            $set:{
                refreshToken:""
            }
        },
        {
            new:true
        })
        if(!userInstance){
            resp.status(404).send(new ApiResponse(404,null,"User not found"))
            return
        }
        resp.status(200).send(new ApiResponse(200,null,"Logout successful"))
        return
    }
    if(req?.user?.usertype=="vendor"){
        let userInstance=await vendorModel.findOneAndUpdate({_id:req.user._id},{
            $set:{
                refreshToken:""
            }
        },
        {
            new:true
        })
        if(!userInstance){
            resp.status(404).send(new ApiResponse(404,null,"User not found"))
            return
        }
        resp.status(200).send(new ApiResponse(200,null,"Logout successful"))
        return
    }
})
export const profile=tryCatchWrapper(async(req,resp)=>{
    const fieldsToExclude = ["refreshToken", "__v","loginCounts","_id"];
    const filteredObject = Object.keys(req.user)
    .filter(key => !fieldsToExclude.includes(key))
    .reduce((obj, key) => {
        obj[key] = req.user[key];
        return obj;
    }, {});
    resp.status(200).send(new ApiResponse(200,filteredObject,"Profile found"))
})