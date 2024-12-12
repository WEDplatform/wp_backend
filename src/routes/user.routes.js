import { Router } from "express";
import { userLoginHandler, userRegisterHandler } from "../controllers/user.controller.js";
const userRouter=Router();
userRouter.route("/signup").post(userRegisterHandler)
userRouter.route("/login").post(userLoginHandler)


export {userRouter}