import { Router } from "express";
const commonRouter=Router()
import { checkClientAuth, getVendor, logout, populatePhotoMedia, profile } from "../controllers/common.controller.js";
import { checkUserAuth } from "../middlewares/userauth.middleware.js";
commonRouter.route("/checkClientAuth").get(checkClientAuth)
commonRouter.route("/logout").post(checkUserAuth,logout)
commonRouter.route("/profile").get(checkUserAuth,profile)
commonRouter.route('/getPhotos').get(populatePhotoMedia)
commonRouter.route('/groupVendor').get(getVendor)
export {commonRouter}