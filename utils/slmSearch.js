import { HfInference } from "@huggingface/inference";
import { tryCatchWrapper } from "./asyncHandler.js";
import { ApiResponse } from "./Apiresponse.js";
const client = new HfInference(process.env.HUGGING_FACE_API_KEY);
const slmSearch = tryCatchWrapper(async (req,resp) => {
    const chatCompletion = await client.chatCompletion({
        model: "google/gemma-2-9b-it",
        messages: [
            {
                role: "user",
                content: `extract keywords and just only provide a list or array of this with no other extra words which exactly matches the context and is in the provided text "${req.body.query}"`,
            }
        ],
        provider: "together",
        max_tokens: 100, 
    });
    
    console.log(chatCompletion.choices[0].message);
    resp.status(200).send(new ApiResponse(200,JSON.parse(chatCompletion.choices[0].message.content),"success"))
    //return chatCompletion.choices[0].message
})
export {slmSearch}