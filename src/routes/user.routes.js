import { Router } from "express";
import { pseudoApi, refreshAccessToken, updateUserPreferences, userLoginHandler, userRegisterHandler,populateUser, likePost, followVendor } from "../controllers/user.controller.js";
import { usernameAvailability } from "../controllers/user.controller.js";
import { openapiMiddleware } from "../middlewares/openapi.middleware.js";
import { checkUserAuth } from "../middlewares/userauth.middleware.js";
const userRouter=Router();
userRouter.route("/signup").post(userRegisterHandler)
userRouter.route("/login").post(userLoginHandler)
userRouter.route("/generateToken").post(refreshAccessToken)
userRouter.route("/generateUsers").post(populateUser)
//secure routes
userRouter.route("/usernameAvalaiblity").post(openapiMiddleware,usernameAvailability)
userRouter.route("/pseudo").get(checkUserAuth,pseudoApi)
userRouter.route("/updatePreferences").post(checkUserAuth,updateUserPreferences)
userRouter.route('/likePost').post(checkUserAuth,likePost)
userRouter.route('/followVendor').post(checkUserAuth,followVendor)
export {userRouter}