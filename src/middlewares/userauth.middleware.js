import {  tryCatchWrapper } from "../../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { userModel } from "../models/user.model.js";
import { ApiError } from "../../utils/Apierror.js";
import { vendorModel } from "../models/vendor.model.js";


export const checkUserAuth = tryCatchWrapper(async (req, res, next) => {
  const credentials = req.get("wedoraCredentials");

  // Step 1: Basic header check
  if (!credentials || !credentials.startsWith("ey")) { 
    // "ey" = base64 prefix of valid JWTs
    return res.status(401).send(new ApiError(401, "Unauthorized request"));
  }

  let decoded;
  try {
    decoded = jwt.verify(credentials, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).send(new ApiError(401, "Invalid or expired token"));
  }

  // Step 2: Check if decoded contains valid structure
  if (!decoded?._id || !decoded?.typeClient) {
    return res.status(400).send(new ApiError(400, "Invalid token payload"));
  }

  // Step 3: Dynamically pick model based on client type
  const modelMap = {
    user: userModel,
    vendor: vendorModel,
  };

  const Model = modelMap[decoded.typeClient];
  if (!Model) {
    return res.status(400).send(new ApiError(400, "Invalid client type"));
  }

  // Step 4: Find user/vendor and validate stored refresh token
  const foundUser = await Model.findById(decoded._id).lean();
  if (!foundUser) {
    return res.status(404).send(new ApiError(404, `${decoded.typeClient} not found`));
  }

  if (foundUser.refreshToken !== credentials) {
    return res.status(401).send(new ApiError(401, "Auth failed. Get new token."));
  }

  // Step 5: Attach user/vendor to request
  req.user = foundUser;
  next();
});

