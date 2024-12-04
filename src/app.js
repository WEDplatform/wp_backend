import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
let app=express();
app.use(cors(
    {
        origin:process.env.CLIENT_URL,
        credentials:true
    }
))
app.use(cookieParser())
app.use(express.json({
    limit:""
}))
app.use(express.urlencoded({extended:true,limit:""}))
app.use(express.static("public"))
export {app}