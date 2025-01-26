import { Router } from "express";
import { vendorLoginHandler, vendorRegisterHandler,populateVendor } from "../controllers/vendor.controller.js";
const vendorRouter=Router();
vendorRouter.route("/signup").post(vendorRegisterHandler)
vendorRouter.route("/login").post(vendorLoginHandler)
vendorRouter.route("/generateVendor").post(populateVendor)

export {vendorRouter}