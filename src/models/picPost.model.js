import mongoose,{ Schema } from "mongoose";
const srcSchema = new Schema({
  original: { type: String },
  large2x: { type: String },
  large: { type: String },
  medium: { type: String },
  small: { type: String },
  portrait: { type: String },
  landscape: { type: String },
  tiny: { type: String },
});
const photoSchema = new Schema({
  name:{
    type:String,
    required:true //this part shows ve
  },
  rating:{
    type:String,
    default:"0"
  },
  images:{
    type:[String]
  } ,
  prices:{
    type:String
  },
  address:{
    type:[String]
  },
  description:{
    type:String
  } 
});
const picSectionSchema=new Schema({
    avg_color:{type:String},
    alt:{type:String},
    src:{type:srcSchema} 
})
const vendorPostPicSchema=new Schema({
    vendorName:{type:String},
    imageData:[picSectionSchema]
})
const picModel = mongoose.model('photo', photoSchema);
const vendorPicModel=mongoose.model('vendorPic',vendorPostPicSchema)  
export {picModel,vendorPicModel}