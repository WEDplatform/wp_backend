import { ApiResponse } from "../../utils/Apiresponse";
import { tryCatchWrapper } from "../../utils/asyncHandler";
import fs from "fs"
const populateCouple=tryCatchWrapper(async(requestAnimationFrame,resp)=>{
    const couples=fs.readFileSync('utils/WedMeGoodCouples.json')
    let vnd=JSON.parse(couples)
    resp.status(200).send(new ApiResponse(200,vnd[0],'Couple model control'))
})
export {populateCouple}