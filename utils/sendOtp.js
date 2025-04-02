import { ApiResponse } from "./Apiresponse.js";
import { tryCatchWrapper } from "./asyncHandler.js";

const sendOtp = tryCatchWrapper(async (req, resp) => {
    const { target } = req.body;  // Extract target from request body

    if (!target) {
        return resp.status(400).json({ error: "Missing required parameter: target" });
    }

    const url = 'https://sms-verify3.p.rapidapi.com/send-numeric-verify';
    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': '054e1172a3msh578ca1da25d622ep1f3babjsn12f995c28b31',
            'x-rapidapi-host': 'sms-verify3.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ target }) // Ensure body is stringified
    };
    try {
        const response = await fetch(url, options);
        const result = await response.json(); // Use `.json()` instead of `.text()`
        resp.status(200).json(new ApiResponse(200, result, "OTP sent successfully"));
    } catch (error) {
        console.error(error);
        resp.status(500).send(new ApiResponse(500, null, "Failed to send OTP"));
    }
});
export {sendOtp}