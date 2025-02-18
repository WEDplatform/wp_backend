import { ApiResponse } from "../../utils/Apiresponse";
import { tryCatchWrapper } from "../../utils/asyncHandler";

const populateCouple=tryCatchWrapper(async(requestAnimationFrame,resp)=>{
    resp.status(200).send(new ApiResponse(200,null,'Couple model control'))
})
export {populateCouple}