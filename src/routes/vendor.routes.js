import { Router } from "express";
import { vendorLoginHandler, vendorRegisterHandler,populateVendor, getSubscribers } from "../controllers/vendor.controller.js";
import { populateCouple } from "../controllers/couple.controller.js";
import { checkClientAuth } from "../controllers/common.controller.js";
import { checkUserAuth } from "../middlewares/userauth.middleware.js";
const vendorRouter=Router();
vendorRouter.route("/signup").post(vendorRegisterHandler)
vendorRouter.route("/login").post(vendorLoginHandler)
vendorRouter.route("/generateVendor").post(populateVendor)
//pseudo type for vendor
vendorRouter.route('/generateCouple').post(populateCouple)
vendorRouter.route('/getSubscribers').get(checkUserAuth,getSubscribers)
export {vendorRouter}