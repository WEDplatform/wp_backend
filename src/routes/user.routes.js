import { Router } from "express";
import { userLoginHandler, userRegisterHandler } from "../controllers/user.controller.js";
import { usernameAvailability } from "../controllers/user.controller.js";
import { openapiMiddleware } from "../middlewares/openapi.middleware.js";
const userRouter=Router();
userRouter.route("/signup").post(userRegisterHandler)
userRouter.route("/login").post(userLoginHandler)

//secure routes
 
userRouter.route("/usernameAvalaiblity").post(openapiMiddleware,usernameAvailability)

export {userRouter}