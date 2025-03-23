import mongoose,{Schema} from "mongoose"

// Export the model


const videoSchema = new mongoose.Schema({
  hashtags: {
    type: [String],
    default: []
  },
  likesCount: {
    type: Number
  },
  displayUrl: {
    type: String
  },
  videoDuration: {
    type: Number
  },
  videoViewCount: {
    type: Number
  },
  caption: {
    type: String,
    set: (caption) => caption.replace(/\n/g, '')
  },
  ownerUsername: {
    type: String
  },
  type: {
    type: String
  },
  videoUrl: {
    type: String,
    
  },
  commentsCount: {
    type: Number
  }
}, { timestamps: true });



const videoPostModel = mongoose.model("video", videoSchema);
const vendorReelSchema=new Schema({
    vendorName:{type:String},
    videoData:[videoSchema]
})
const vendorReelModel=mongoose.model("vendorReel",vendorReelSchema) 
export {videoPostModel,vendorReelModel}