import { ApiResponse } from "../../utils/Apiresponse.js";
import { tryCatchWrapper } from "../../utils/asyncHandler.js";

export const openapiMiddleware=tryCatchWrapper(async(req,resp,next)=>{
    const authHeader=req.get("Authorization").replace("Bearer ","")
    if(!authHeader){
        resp.status(403).send(new ApiResponse(403,null,"Unauthorized request"))
        return
    }
    if(authHeader!==process.env.OPEN_API_KEY){
        resp.status(404).send(new ApiResponse(404,null,"Unable to verify open api key"))
        return
    }
    next()
    
})