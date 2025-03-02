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
      },
      isSavedBy:{
        type:[{
          userId:{
            type:String
          },
          username:{type:String},
          isSavedAs:{
            type:String,
            default:"vendor",
            Enumerators:["vendor","idea"]
          }
        }]
      }
})
const coupleModel = mongoose.model('couple',coupleSchema)
export {coupleModel}