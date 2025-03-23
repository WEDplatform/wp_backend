import mongoose,{Schema} from "mongoose"

// Export the model


const videoSchema = new mongoose.Schema({
  hashtags: {
    type: [String],
    default: []
  },
  likesCount: {
    type: Number,
    required: true
  },
  displayUrl: {
    type: String,
    required: true
  },
  videoDuration: {
    type: Number,
    required: true
  },
  videoViewCount: {
    type: Number,
    required: true
  },
  caption: {
    type: String,
    required: true,
    set: (caption) => caption.replace(/\n/g, '')
  },
  ownerUsername: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Video', 'Image'],
    required: true
  },
  videoUrl: {
    type: String,
    required: function () {
      return this.type === 'Video';
    }
  },
  commentsCount: {
    type: Number,
    required: true
  }
}, { timestamps: true });



const videoPostModel = mongoose.model("video", videoSchema);
const vendorReelSchema=new Schema({
    vendorName:{type:String},
    videoData:[videoSchema]
})
const vendorReelModel=mongoose.model("vendorReel",vendorReelSchema) 
export {videoPostModel,vendorReelModel}