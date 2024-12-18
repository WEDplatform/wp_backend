import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import { userRouter } from "./routes/user.routes.js";
import { vendorRouter } from "./routes/vendor.routes.js";
import { commonRouter } from "./routes/common.route.js";
let app=express();
app.use(cors(
    {
        origin:["http://localhost:3000","https://wp-frontend-eight.vercel.app"],
        credentials:true
    }
))
// app.use(function(req,resp,next){
//     resp.header("Access-Control-Allow-Origin","*")
//     next()
// })
app.use(cookieParser())
app.use(express.json({
    limit:""
}))
app.use(express.urlencoded({extended:true,limit:""}))
app.use(express.static("public"))
app.use("/api/v1/user",userRouter);
app.use("/api/v1/vendor",vendorRouter)
app.use("/api/v1/cmn",commonRouter)
app.get("/",(req,resp)=>{
    resp.send("Running")
})
export {app}