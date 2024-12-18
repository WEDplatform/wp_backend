import { Router } from "express";
const commonRouter=Router()
import { checkClientAuth } from "../controllers/common.controller.js";
commonRouter.route("/checkClientAuth").post(checkClientAuth)

export {commonRouter}