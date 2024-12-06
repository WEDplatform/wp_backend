import { Router } from "express";
import { userRegisterHandler } from "../controllers/user.controller.js";
const userRouter=Router();
userRouter.route("/login").post(userRegisterHandler)

export {userRouter}