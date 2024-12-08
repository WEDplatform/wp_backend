import { upload } from "../middlewares/multer.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
const userRegisterHandler=asyncHandler(async(req,resp)=>{
    resp.status(200).json({
        message:"Register router user"
    })
})
const userLoginHandler=asyncHandler(async(req,resp)=>{
    console.log(req.body);
    resp.status(200).json({
        message:"Login router user"
    });
    
})
export {userRegisterHandler,userLoginHandler}