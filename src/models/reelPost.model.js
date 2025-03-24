import mongoose,{Schema} from "mongoose"

// Export the model
const CommentSchema = new mongoose.Schema({
  text: String,
  ownerUsername: String,
  ownerProfilePicUrl: String,
  timestamp: Date,
  repliesCount: Number,
  replies: [
    {
      id: String,
      text: String,
      ownerUsername: String,
      ownerProfilePicUrl: String,
      timestamp: Date,
      repliesCount: Number,
      likesCount: Number,
      owner: {
        id: String,
        is_verified: Boolean,
        profile_pic_url: String,
        username: String,
      },
    },
  ],
  likesCount: Number,
  owner: {
    id: String,
    is_verified: Boolean,
    profile_pic_url: String,
    username: String,
  },
});
const videoSchema = new mongoose.Schema({
  latestComments: [CommentSchema],
  hashtags: [String],
  images: [String],
  commentsCount: Number,
  videoPlayCount: Number,
  caption: String,
  dimensionsHeight: Number,
  videoDuration: Number,
  dimensionsWidth: Number,
  videoUrl: String,
  likesCount: Number,
  displayUrl: String,
  videoViewCount: Number,
  type: String,
  ownerUsername: String,
  locationName: String,
  ownerFullName: String,
});








// const videoSchema = new mongoose.Schema({
//   hashtags: {
//     type: [String],
//     default: []
//   },
//   likesCount: {
//     type: Number
//   },
//   displayUrl: {
//     type: String
//   },
//   videoDuration: {
//     type: Number
//   },
//   videoViewCount: {
//     type: Number
//   },
//   caption: {
//     type: String,
//     set: (caption) => caption.replace(/\n/g, '')
//   },
//   ownerUsername: {
//     type: String
//   },
//   type: {
//     type: String
//   },
//   videoUrl: {
//     type: String,
    
//   },
//   commentsCount: {
//     type: Number
//   }
// }, { timestamps: true });



const videoPostModel = mongoose.model("video", videoSchema);
const vendorReelSchema=new Schema({
    vendorName:{type:String},
    videoData:[videoSchema]
})
const vendorReelModel=mongoose.model("vendorReel",vendorReelSchema) 
export {videoPostModel,vendorReelModel}