import mongoose,{ Schema } from "mongoose";
const coupleSchema=new Schema({
    coupleName:{
        type:String
    },
    couplecover:{
        type:[String]
    },
    name:{
        type:String
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
      }
})
const coupleModel = mongoose.model('couple',coupleSchema)
export {coupleModel}