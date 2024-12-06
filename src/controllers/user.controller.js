import { asyncHandler } from "../../utils/asyncHandler.js";
const userRegisterHandler=asyncHandler(async(req,resp)=>{
    resp.status(200).json({
        message:"Register router user"
    })
})
export {userRegisterHandler}