import { tryCatchWrapper } from "../../utils/asyncHandler";

export const openapiMiddleware=tryCatchWrapper(async(req,resp,next)=>{
    console.log(req);
    next()
    
})