import { ApiResponse } from "../../utils/Apiresponse.js";
import { tryCatchWrapper } from "../../utils/asyncHandler.js";
import fs from "fs"
import { coupleModel } from "../models/couple.model.js";
const populateCouple=tryCatchWrapper(async(requestAnimationFrame,resp)=>{
    const couples=fs.readFileSync('utils/WedMeGoodCouples.json')
    let vnd=JSON.parse(couples)
    Promise.all(vnd.map(async(cpl)=>{
        await coupleModel.create(cpl)
    }))
    resp.status(200).send(new ApiResponse(200,vnd[0],'Couple model control'))
})
export {populateCouple}