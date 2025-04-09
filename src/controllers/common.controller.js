import { tryCatchWrapper } from "../../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { userModel } from "../models/user.model.js";
import { vendorModel } from "../models/vendor.model.js";
import { ApiError } from "../../utils/Apierror.js";
import { ApiResponse } from "../../utils/Apiresponse.js";
import { createClient } from "pexels";
import fs from 'fs'// not needed
import { bizName } from "../../utils/bizname.js";
const client = createClient(process.env.PEXEL_API_KEY);

import { picModel, vendorPicModel } from "../models/picPost.model.js";
import { vendorReelModel, videoPostModel } from "../models/reelPost.model.js";
import { coupleModel } from "../models/couple.model.js";
import { chatModel } from "../models/chat.model.js";
import { getInstaData } from "../../utils/apify.js";
export const checkClientAuth=tryCatchWrapper(async(req,response)=>{
    let credentials=req.get("wedoraCredentials")
    
    if(!credentials){ 
       response.status(401).send(new ApiError(401,"Unauthorized request"))
        return
    }
    jwt.verify(credentials,process.env.JWT_SECRET,async(err,user)=>{
        if(err){
            console.log(err);
           response.status(401).send(new ApiError(401,"Auth failed get new token"))
            return
        }
        response.status(200).send(new ApiResponse(200,user,"user authenticated"))  
    })
})
export const logout=tryCatchWrapper(async(req,resp)=>{
    if(req?.user?.usertype=="user"){
        let userInstance=await userModel.findOneAndUpdate({_id:req.user._id},{
            $set:{
                refreshToken:""
            }
        },
        {
            new:true
        })
        if(!userInstance){
            resp.status(404).send(new ApiResponse(404,null,"User not found"))
            return
        }
        resp.status(200).send(new ApiResponse(200,null,"Logout successful"))
        return
    }
    if(req?.user?.usertype=="vendor"){
        let userInstance=await vendorModel.findOneAndUpdate({_id:req.user._id},{
            $set:{
                refreshToken:""
            }
        },
        {
            new:true
        })
        if(!userInstance){
            resp.status(404).send(new ApiResponse(404,null,"User not found"))
            return
        }
        resp.status(200).send(new ApiResponse(200,null,"Logout successful"))
        return
    }
})
export const profile = tryCatchWrapper(async (req, resp) => {
    try {
        const fieldsToExclude = ["refreshToken", "__v", "loginCounts", "_id"];
        let userProfile = { ...req.user };
        let vendor_and_coupleCollection=[];
        if (req.user.usertype == 'user') {
            if (req.user.vendorLiked.length > 0) {
                let likedVendorIds = req.user.vendorLiked.map(i => i.id); // `type` stores the ObjectId
                let data = await vendorPicModel.find({ _id: { $in: likedVendorIds },isLikedBy:{$elemMatch:{userId:req.user._id}} }).select('-address -description -tags -review');
                data={type:"likedVendors",items:data}
                vendor_and_coupleCollection.push(data)
            }
            if (req.user.coupleLiked.length > 0) {
                let likedCoupleIds = req.user.coupleLiked.map(i => i.id);
                let data = await coupleModel.find({ _id: { $in: likedCoupleIds },isLikedBy:{$elemMatch:{userId:req.user._id}} }).select('-address -description -tags -review');
                data={type:"likedCouples",items:data}
                vendor_and_coupleCollection.push(data)
            }
            // Handle Vendor Followed
            if (req.user.vendorFollowed.length > 0) {
                let followedVendorIds = req.user.vendorFollowed.map(i => i.id);
                let data = await vendorPicModel.find({ _id: { $in: followedVendorIds } ,followedBy:{$elemMatch:{userId:req.user._id}}}).select('-address -description -tags -review');;
                data={type:"followedVendors",items:data}
                vendor_and_coupleCollection.push(data)
            }
            if(req.user.vendorSaved.length>0){
                let savedVendorIds = req.user.vendorSaved.map(i => i.id);
                let data = await vendorPicModel.find({ _id: { $in: savedVendorIds },isSavedBy:{$elemMatch:{userId:req.user._id,isSavedAs:"idea"}} }).select('name isSavedBy images');
                data={type:"savedIdea",items:data}
                vendor_and_coupleCollection.push(data)
            }
            if(req.user.vendorSaved.length>0){
                let savedVendorIds = req.user.vendorSaved.map(i => i.id);
                let data = await vendorPicModel.find({ _id: { $in: savedVendorIds },isSavedBy:{$elemMatch:{userId:req.user._id,isSavedAs:"vendor"}} }).select('name isSavedBy images');
                data={type:"savedVendor",items:data}
                vendor_and_coupleCollection.push(data)
            }
        } 
        resp.status(200).send(new ApiResponse(200, {userProfile:req.user,vendor_and_coupleCollection}, "Profile found"));
    } catch (error) {
        console.error("Error fetching profile:", error);
        resp.status(500).send(new ApiResponse(500, null, "Internal Server Error"));
    }
});

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
export const populatePhotoMedia=tryCatchWrapper(async(req,resp)=>{
    const {qr,pageI}=req.body;
     const res=await client.photos.search({query:qr,per_page:80,page:pageI,orientation:'landscape'})
     const Photos=res.photos; 
     Photos.map((i,p)=>i.vendorName=bizName[getRandomInt(bizName.length)])
     const responseInsertion=await picModel.insertMany(Photos)
    resp.status(200).send(new ApiResponse(200,responseInsertion,"Photo media populated"))
})
export const getVendor=tryCatchWrapper(async(req,resp)=>{
    // let jsonFiles=fs.readdirSync('utils/igData')
    // jsonFiles=jsonFiles.map((i)=>i.replace('.json',''))
    // jsonFiles.map(async(user)=>{
    //     let vendorObject={
    //         businessName:user,
    //         password:"1234567890",
    //         businessEmail:`${user}@gmail.com`,
    //         businessPhone:"1234567890",
    //         gstNumber:"GST0000000001IND",
    //     }
    //     await vendorModel.create(vendorObject)
    // })
    
    resp.status(200).send(new ApiResponse(200,null,"Vendor found"))
})
function generatePhoneNumber() {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}
export const getVendorReels=tryCatchWrapper(async(req,resp)=>{
    
    let jsonFiles=fs.readdirSync('utils/igData')
    jsonFiles=jsonFiles.map((i)=>i.replace('.json',''))
    jsonFiles.map(async(user)=>{
        let vendorObject={
            businessName:user,
            password:"1234567890",
            businessEmail:`${user}@gmail.com`,
            businessPhone: `${generatePhoneNumber()}`,
            gstNumber:"GST0000000001IND",
        }
        //await vendorModel.findOneAndDelete({businessEmail:`${user}@gmail.com`})
        await vendorModel.create(vendorObject)
    })
    resp.status(200).send(new ApiResponse(200,jsonFiles,"Video found"))
})
export const groupVideos=tryCatchWrapper(async(req,resp)=>{
    Promise.all(bizName.map(async(user)=>{
        const vendorDetails=await videoPostModel.find({vendorName:user})
       await vendorReelModel.create({vendorName:user,videoData:vendorDetails})
       }))
    resp.status(200).send(new ApiResponse(200,null,"Videos found"))
})
export const getPics=tryCatchWrapper(async(req,resp)=>{
    const srchPage =req.query;
    const userId=req.user._id
    let numberOfdata=parseInt(srchPage.per_page)
    if(!numberOfdata || numberOfdata<=0){
        numberOfdata=3;
    } 
    let page=parseInt(srchPage.searchIndex);
    let pageBreak=numberOfdata;
    if(page<0 || !page){
        page=0;
    }   
    let doc_count=await vendorPicModel.countDocuments()
    let vendorDetails;
    let isSearched=srchPage.searchStatus
    if(isSearched=="true"){
    const searchList=req.body.searchArray;
    const regexArray = req.body?.map((str) => new RegExp(str, "i"));
    vendorDetails=await vendorPicModel.find({
        $or: [ 
            { name: { $in: regexArray } },
            { tags:  { $elemMatch: { $in: regexArray } } },
            { address: { $elemMatch: { $in: regexArray } } },
            { description: { $in: regexArray } }
          ]
    }).limit(numberOfdata).skip(page*numberOfdata).exec()
    }else{ 
        vendorDetails=await vendorPicModel.find({}).limit(numberOfdata).skip(page*numberOfdata).exec()
    }
    if(vendorDetails.length==0 || !vendorDetails){
        resp.status(404).send(new ApiResponse(200,{
            pics:[], 
            hasMore:false 
        },"No vendors found"))
        return 
    }else{
        vendorDetails = vendorDetails.map(vendor => ({
            ...vendor._doc, // Spread existing fields
            isLikedByUser: vendor.isLikedBy.some(user => user.userId.toString() === userId.toString() && user.liked),
            isSavedByUser: vendor.isSavedBy.some(user => user.userId.toString() === userId.toString() ) 
        }));
        resp.status(200).send(new ApiResponse(200,{
            total:doc_count,
            pics:vendorDetails,
            hasMore:pageBreak<doc_count
        },"Pics found"))
    }
})
export const getCouplePost=tryCatchWrapper(async(req,resp)=>{
    const srchPage =req.query;
    const userId=req.user._id
    let numberOfdata=parseInt(srchPage.per_page)
    if(!numberOfdata || numberOfdata<=0){
        numberOfdata=3;
    }
    let page=parseInt(srchPage.searchIndex);
    let pageBreak=numberOfdata;
    if(page<0 || !page){
        page=0;
    }
    let doc_count=await coupleModel.countDocuments()
    let couplePosts=await coupleModel.find({}).limit(numberOfdata).skip(page*numberOfdata).exec()
    
    if(couplePosts.length==0 || !couplePosts){
        resp.status(404).send(new ApiResponse(200,{
            cposts:[],
            hasMore:false 
        },"No vendors found"))
        return
    }else{
        couplePosts = couplePosts.map(vendor => ({
            ...vendor._doc, // Spread existing fields
            isLikedByUser: vendor.isLikedBy.some(user => user.userId.toString() === userId.toString() && user.liked) 
        }));
        resp.status(200).send(new ApiResponse(200,{
            total:doc_count,
            cposts:couplePosts,
            hasMore:pageBreak<doc_count
        },"Pics found"))
    }
})
export const getReels = tryCatchWrapper(async (req, resp) => {
     let numberOfdata = parseInt(req.query.per_page) || 3; // Default 3 items
     let searchIndex=parseInt(req.query.searchIndex);
     let doc_count = await videoPostModel.countDocuments();
    if (doc_count === 0) {
        return resp.status(404).send(new ApiResponse(200, {
            hasMore: false,
            reels: []
        }, "No videos found"));
    }
    let vendorDetails = await videoPostModel.aggregate([
        { $match: { type: "Video" } }, // Ensure only 'Video' type is fetched
        { $sample: { size: numberOfdata } } // Random selection
    ]);
    const igData=await getInstaData(vendorName,numberOfdata)
    await Promise.all([
        vendorDetails.map((item)=>
        getInstaData(item.ownerUsername,2)
        )
    ])
    return resp.status(200).send(new ApiResponse(200, {
        total: doc_count,
        hasMore: numberOfdata < doc_count,
        reels: igData 
    }, "Random videos found"));
});
export const getVendorDetails=tryCatchWrapper(async(req,resp)=>{
    const query=req.query; 
    const userId=req.user._id.toString()
       if(!query?.vendorName){
        resp.status(403).send(new ApiResponse(403,null,'invalid query strings'))
        return 
    }
    let details;
    if(query.type=='post'){
        details=await vendorPicModel.findOne({name:query.vendorName})
    }else{
        details=await vendorModel.findOne({businessName:query.vendorName})
    }
    if(!details){ 
        resp.status(404).send(new ApiResponse(404,null,'no vendor found'))
        return 
    } 
    details = details.toObject();
    let sideDetails;
    if(query.type=='post'){
        sideDetails=await vendorModel.findOne({businessName:query.vendorName}) 
        details.vid=sideDetails._id.toString() // Convert Mongoose document to plain object
    }else{
        details.vid=details._id.toString()
    }
    details['isLikedByUser'] = details?.isLikedBy?.some(user => user.userId.toString() === userId && user.liked);
    details['isFollowed']=details?.followedBy?.some(user=>user.userId.toString()===userId) || false
        resp.status(200).send(new ApiResponse(200,details,'found'))
}) 
export const getVendorMediaPosts=tryCatchWrapper(async(req,resp)=>{
    const srchPage =req.query;
    if(!srchPage?.vendorName){
        resp.status(404).send(new ApiResponse(404,null,'invallid vendor name'))
        return
    }
    let numberOfdata=parseInt(srchPage.per_page)
    if(!numberOfdata || numberOfdata<=0){
        numberOfdata=3;
    }
    let page=parseInt(srchPage.searchIndex);
    let pageBreak=numberOfdata;
    if(page<0 || !page){
        page=0;
    }
    const total=await picModel.countDocuments({vendorName:srchPage?.vendorName})
    const postDetails=await picModel.find({vendorName:srchPage?.vendorName}).limit(numberOfdata).skip(page*numberOfdata)
    if(postDetails.length==0 || !postDetails){
        resp.status(404).send(new ApiResponse(404,{
            total:total,
            hasMore:false,
            pics:[]
        },'no data available'))
        return
    }
    resp.status(200).send(new ApiResponse(200,{
        total:total,
        hasMore:page*numberOfdata<total,
        pics:postDetails
    },'found'))
})
export const getVendorMediaReels=tryCatchWrapper(async(req,resp)=>{
    const srchPage =req.query;
    console.log(srchPage);
    
    if(!srchPage?.vendorName){
        resp.status(404).send(new ApiResponse(404,null,'invallid vendor name'))
        return
    }
    let numberOfdata=parseInt(srchPage.per_page)
    if(!numberOfdata || numberOfdata<=0){
        numberOfdata=3;
    }
    let page=parseInt(srchPage.searchIndex);
    let pageBreak=numberOfdata;
    if(page<0 || !page){
        page=0;
    } 
    const total=await videoPostModel.countDocuments({ownerUsername:srchPage?.vendorName,type:"Video"})
    const postDetails=await videoPostModel.find({ownerUsername:srchPage?.vendorName,type:"Video"}).limit(numberOfdata).skip(page*numberOfdata)
    if(postDetails.length==0 || !postDetails){
        resp.status(404).send(new ApiResponse(404,{
            total:total,
            hasMore:false,
            pics:[]
        },'no data available'))
        return
    }
    console.log(postDetails);
    
    resp.status(200).send(new ApiResponse(200,{
        total:total,
        hasMore:page*numberOfdata<total,
        reels:postDetails
    },'found'))
})
export const searchPosts_Couples=tryCatchWrapper(async(req,resp)=>{
    const searchList=req.body.searchArray;
    const regexArray = searchList.map((str) => new RegExp(str, "i"));
    const VendorList=await vendorPicModel.find({
        $or: [
            { name: { $in: regexArray } },
            { tags:  { $elemMatch: { $in: regexArray } } },
            { address: { $elemMatch: { $in: regexArray } } },
            { description: { $in: regexArray } }
          ]
    }).limit(3)
    // const CoupleList=await coupleModel.find({
    // })
    if(!VendorList){
        resp.status(501).send(new ApiError(501,'intenal error'))
    }else{
        resp.status(203).send(new ApiResponse(203,VendorList,'found'))
    }
})
const getTodayDate = () => {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset()); // Adjust for time zone
    today.setHours(0, 0, 0, 0); // Normalize to start of the day
    return today;
};
function filterNotInCommon(arr1, arr2) {
    return [
        ...arr1.filter(item => !arr2.includes(item)), 
        ...arr2.filter(item => !arr1.includes(item))
    ];
}
export const populateMessage = tryCatchWrapper(async (packet,currentRooms) => {
    const { roomID, payload } = packet;
    //console.log(currentRooms.find(room=>room.roomID==roomID));
    // Get today's date correctly in local time
    const today = getTodayDate();
    console.log("Current Date:", today); // Debugging to check the correct date
    const chat = await chatModel.findOne({ "subscribers.uuid": roomID});
    if (!chat) {
        console.log("Chat room not found.");
        return;
    }
    let updated = false;
    // Iterate through subscribers to find the correct one 
    chat.subscribers.forEach((subscriber) => {
        if (subscriber.uuid === roomID) {
            let notConnectedUsers=filterNotInCommon(subscriber.roomUsers,currentRooms.find(room=>room.roomID==roomID).currentUsers)
            console.log(notConnectedUsers);
            if(notConnectedUsers.length>0){
                subscriber.unseenMessages.push({message:payload.text,notSeenBy:notConnectedUsers})
            }
            let todayMessage = subscriber.messages.find(
                (msg) => new Date(msg.chatDate).setHours(0, 0, 0, 0) === today.getTime()
            );
            if (todayMessage) {
                // If today's chat thread exists, push the new message
                todayMessage.payloads.push(payload);
            } else {
                // If no chat thread for today, create one
                subscriber.messages.push({
                    chatDate: today,
                    payloads: [payload],
                });
            }
            subscriber.lastMessage = payload.text;
            updated = true;
        }
    });
    if (updated) {
        await chat.save();
        //console.log("Message updated successfully!");
    } else {
        console.log("No subscriber matched the given roomID.");
    }
});
export const getMessages = tryCatchWrapper(async (req, resp) => {
    const { roomID  }= req.body;
    
    await chatModel.findOneAndUpdate({ "subscribers.uuid": roomID },{
        $pull: {
            "subscribers.$[].unseenMessages": { notSeenBy: req.user._id.toString() }
        }
    });
    const chat = await chatModel.findOne({ "subscribers.uuid": roomID });
    if (!chat) {
        console.log("Chat room not found.");  
        return;
    }
    const subscriber = chat.subscribers.find((sub) => sub.uuid === roomID);
    if (!subscriber) {
        console.log("Subscriber not found in the chat room.");
        return;
    }
    resp.status(200).send(new ApiResponse(200, subscriber.messages, "Messages found"));
})