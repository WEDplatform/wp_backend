import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import { userRouter } from "./routes/user.routes.js";

let app=express();
app.use(cors(
    {
        origin:["http://localhost:3000","https://wp-frontend-eight.vercel.app/"],
        credentials:true
    }
))
app.use(cookieParser())
app.use(express.json({
    limit:""
}))
app.use(express.urlencoded({extended:true,limit:""}))
app.use(express.static("public"))
app.use("/api/v1/user",userRouter);
export {app}