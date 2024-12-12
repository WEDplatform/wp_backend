import { upload } from "../middlewares/multer.middleware.js";
import { asyncHandler, tryCatchWrapper } from "../../utils/asyncHandler.js";
import { userModel } from "../models/user.model.js";
import { ApiResponse } from "../../utils/Apiresponse.js";
const userRegisterHandler=tryCatchWrapper(async(req,resp)=>{
    let userExistense=await userModel.findOne({email:req.body.email})
    if(userExistense){
        resp.status(409).send(new ApiResponse(409,{
            email:userExistense.email,
            isMobileVerified:userExistense.isMobileVerified
        },"User exists"))
        return
    }
    let userInstance={...req.body,isMobileVerified:false}
    let userSavingInstance=await userModel.create(userInstance)
    console.log(userSavingInstance);
    if(!userSavingInstance){
        resp.status(500).send(new ApiResponse(500,null,"Internal server error"))
        return
    }
    resp.status(200).send(new ApiResponse(200,userSavingInstance,"User no exists"))
})
const userLoginHandler=asyncHandler(async(req,resp)=>{
    const {username,password,phoneNumber}=req.body;
    console.log(req.body);
    resp.status(200).json({
        message:"Login router user"
    });
    
})
export {userRegisterHandler,userLoginHandler}