import { Router } from "express";
const commonRouter=Router() 
import { checkClientAuth, 
    getCouplePost,
    getPics,
    getReels,
    getVendor,
    getVendorDetails,
      getVendorMediaPosts,
       getVendorMediaReels,
        getVendorReels,
         groupVideos,
         logout, 
         populatePhotoMedia, 
         profile } from "../controllers/common.controller.js";
import { checkUserAuth } from "../middlewares/userauth.middleware.js";
commonRouter.route("/checkClientAuth").get(checkClientAuth)
commonRouter.route("/logout").post(checkUserAuth,logout)
commonRouter.route("/profile").get(checkUserAuth,profile)
commonRouter.route('/getVendorProfile').get(getVendorDetails)
commonRouter.route('/getPhotos').get(populatePhotoMedia)
commonRouter.route('/groupVendor').get(getVendor)
commonRouter.route("/getVideos").get(getVendorReels)
commonRouter.route('/groupVideos').get(groupVideos)
//fetching of post data
commonRouter.route("/getPosts").get(getPics)
commonRouter.route('/getReels').get(getReels)
commonRouter.route('/getCouplePosts').get(getCouplePost)
commonRouter.route("/getVendorPosts").get(getVendorMediaPosts)
commonRouter.route("/getVendorReels").get(getVendorMediaReels)
export {commonRouter} 