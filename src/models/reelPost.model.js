import mongoose,{Schema} from "mongoose"

const videoSchema = new Schema({
  id: { type: Number},
  pageURL: { type: String },
  type: { type: String },
  tags: { type: String },
  duration: { type: Number },
  videos: {
    large: {
      url: { type: String },
      width: { type: Number },
      height: { type: Number },
      size: { type: Number },
      thumbnail: { type: String },
    },
    medium: {
      url: { type: String },
      width: { type: Number },
      height: { type: Number },
      size: { type: Number },
      thumbnail: { type: String },
    },
    small: {
      url: { type: String },
      width: { type: Number },
      height: { type: Number },
      size: { type: Number },
      thumbnail: { type: String },
    },
    tiny: {
      url: { type: String },
      width: { type: Number },
      height: { type: Number },
      size: { type: Number },
      thumbnail: { type: String },
    },
  },
  views: { type: Number },
  downloads: { type: Number },
  likes: { type: Number },
  comments: { type: Number },
  user_id: { type: Number },
  user: { type: String },
  userImageURL: { type: String },
});
// Export the model
const videoPostModel = mongoose.model("video", videoSchema);
const vendorReelSchema=new Schema({
    vendorName:{type:String},
    videoData:[videoSchema]
})
const vendorReelModel=mongoose.model("vendorReel",vendorReelSchema) 
export {videoPostModel,vendorReelModel}