import mongoose,{ Schema } from "mongoose";
import { type } from "os";
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
const followSchema=new Schema({
    userId:String,
},{
    timestamps:true
})
const photoSchema = new Schema({
  name:{
    type:String,
    required:true //this part shows vend
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
  },
  review:{
    type:[[String]]
  },
  tags:{
    type:[String]
  },
  isLikedBy:{
    type:[{
      userId:{
        type:Schema.Types.ObjectId
      },
      liked:{
        type:Boolean,
        default:false
      }
    }]
  },
  followedBy:[
    {
      username:{type:String},
      userId:{type:String}
    }
  ]
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
const vendorPicModel=mongoose.model('vendorPic',photoSchema)  
export {picModel,vendorPicModel}