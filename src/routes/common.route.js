import { Router } from "express";
const commonRouter=Router() 
import { checkClientAuth, 
    getCouplePost,
    getMessages,
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
    profile, 
    searchPosts_Couples} from "../controllers/common.controller.js";
import { checkUserAuth } from "../middlewares/userauth.middleware.js";
import { getCoupleDetails } from "../controllers/couple.controller.js";
import { slmSearch } from "../../utils/slmSearch.js";
import { sendOtp } from "../../utils/sendOtp.js";
commonRouter.route("/checkClientAuth").get(checkClientAuth)
commonRouter.route("/logout").post(checkUserAuth,logout)
commonRouter.route("/profile").get(checkUserAuth,profile)
commonRouter.route('/getVendorProfile').get(checkUserAuth,getVendorDetails)
commonRouter.route('/getPhotos').get(populatePhotoMedia)
commonRouter.route('/groupVendor').get(getVendor)
commonRouter.route("/getVideos").get(getVendorReels)
commonRouter.route('/groupVideos').get(groupVideos)
commonRouter.route('/sendOtp').get(sendOtp)
//fetching of post data
commonRouter.route("/getPosts").post(checkUserAuth,getPics)
commonRouter.route('/getReels').get(getReels)
commonRouter.route('/getCouplePosts').get(checkUserAuth,getCouplePost)
commonRouter.route('/getCoupleDetails').get(getCoupleDetails)
commonRouter.route("/getVendorPosts").get(getVendorMediaPosts)
commonRouter.route("/getVendorReels").get(getVendorMediaReels)
commonRouter.route('/getSearchResults').get(searchPosts_Couples)
commonRouter.route('/getMessages').post(checkUserAuth,getMessages)
//testing routes not for production rn
commonRouter.route('/slmSearch').get(slmSearch)
export {commonRouter} 