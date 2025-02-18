import { Router } from "express";
import { vendorLoginHandler, vendorRegisterHandler,populateVendor } from "../controllers/vendor.controller.js";
import { populateCouple } from "../controllers/couple.controller.js";
const vendorRouter=Router();
vendorRouter.route("/signup").post(vendorRegisterHandler)
vendorRouter.route("/login").post(vendorLoginHandler)
vendorRouter.route("/generateVendor").post(populateVendor)

//pseudo type for vendor
vendorRouter.route('/generateCouple').post(populateCouple)
export {vendorRouter}