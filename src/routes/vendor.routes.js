import { Router } from "express";
import { vendorLoginHandler, vendorRegisterHandler } from "../controllers/vendor.controller.js";
const vendorRouter=Router();
vendorRouter.route("/signup").post(vendorRegisterHandler)
vendorRouter.route("/login").post(vendorLoginHandler)
export {vendorRouter}