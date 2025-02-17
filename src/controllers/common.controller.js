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
import _ from "lodash"
import { picModel, vendorPicModel } from "../models/picPost.model.js";
import { vendorReelModel, videoPostModel } from "../models/reelPost.model.js";
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
        //console.log(user);
        
        response.status(200).send(new ApiResponse(200,user,"user authenticated"))  
    })
})
export const logout=tryCatchWrapper(async(req,resp)=>{
    //console.log(req?.user);
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

export const profile=tryCatchWrapper(async(req,resp)=>{
   
    const fieldsToExclude = ["refreshToken", "__v","loginCounts","_id"];
    let filteredObject=_.omit(req.user, ["refreshToken"])
    //console.log(filteredObject);
    resp.status(200).send(new ApiResponse(200,req.user,"Profile found"))
})
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
    //const vendors=fs.readFileSync('utils/vendorlist1.json')
    // const vendorDetails=await picModel.find({vendorName:"Rajendra Caterers"})
    // await vendorPicModel.create({vendorName:"Rajendra Caterers",imageData:vendorDetails})
    Promise.all(bizName.map(async(user)=>{
     const vendorDetails=await picModel.find({vendorName:user})
    await vendorPicModel.create({vendorName:user,imageData:vendorDetails})
    }))
    resp.status(200).send(new ApiResponse(200,null,"Vendor found"))
})

export const getVendorReels=tryCatchWrapper(async(req,resp)=>{
    const {qr,pageIndex}=req.body;
    const videoResponse=await fetch(`https://pixabay.com/api/videos/?key=&q=${encodeURIComponent(qr)}&pretty=true&per_page=200&page=${pageIndex}`)
    let videoResponseJSON=await videoResponse.json()
    let data=videoResponseJSON.hits;
    data.map((i,p)=>i.vendorName=bizName[getRandomInt(bizName.length)]) 
    await videoPostModel.insertMany(data)
    resp.status(200).send(new ApiResponse(200,videoResponseJSON,"Video found"))
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
    let numberOfdata=parseInt(srchPage.per_page)
    if(!numberOfdata || numberOfdata<=0){
        numberOfdata=3;
    }
    console.log(srchPage);
    let page=parseInt(srchPage.searchIndex);
    let pageBreak=numberOfdata;
    if(page<0 || !page){
        page=0;
    }
    let doc_count=await vendorPicModel.countDocuments()
    let vendorDetails=await vendorPicModel.find({}).limit(numberOfdata).skip(page*numberOfdata).exec()
    
    if(vendorDetails.length==0 || !vendorDetails){
        resp.status(404).send(new ApiResponse(200,{
            pics:[],
            hasMore:false 
        },"No vendors found"))
        return
    }else{
        resp.status(200).send(new ApiResponse(200,{
            total:doc_count,
            pics:vendorDetails,
            hasMore:pageBreak<doc_count
        },"Pics found"))
    }
})

export const getReels=tryCatchWrapper(async(req,resp)=>{
    const srchPage =req.query;
    let numberOfdata=parseInt(srchPage.per_page)
    if(!numberOfdata || numberOfdata<=0){
        numberOfdata=3;
    }
    let page=parseInt(srchPage.searchIndex);
    let pageBreak=3;
    if(page<0 || !page){
        page=0;
    }
    let doc_count=await videoPostModel.countDocuments()
    let vendorDetails=await videoPostModel.find({}).limit(numberOfdata).skip(page*numberOfdata).exec()
    if(vendorDetails.length==0 || !vendorDetails){
        resp.status(404).send(new ApiResponse(200,{
            hasMore:false,
            reels:[]
        },"No vendors found"))
        return
    }else{
        resp.status(200).send(new ApiResponse(200,{
            total:doc_count,
            hasMore:page*pageBreak<doc_count,
            reels:vendorDetails
        },"videos found"))
    }
})
export const getVendorDetails=tryCatchWrapper(async(req,resp)=>{
    const query=req.query;
       if(!query?.vendorName){
        resp.status(403).send(new ApiResponse(403,null,'invalid query strings'))
        return 
    }
    let details=await vendorModel.findOne({businessName:query.vendorName})
    if(!details){ 
        resp.status(404).send(new ApiResponse(404,null,'no vendor found'))
        return
    }
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
    const total=await videoPostModel.countDocuments({vendorName:srchPage?.vendorName})
    const postDetails=await videoPostModel.find({vendorName:srchPage?.vendorName}).limit(numberOfdata).skip(page*numberOfdata)
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
        reels:postDetails
    },'found'))
})