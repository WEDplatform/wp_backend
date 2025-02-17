import mongoose from "mongoose";
import { dbname } from "../constants.js";
export const connectDB=async()=>{
    try {
        let connection_instance=await mongoose.connect(`${process.env.MONGO_URI}/${dbname}`);
        let connection_state=connection_instance.connections[0].readyState
        if(connection_state===1){
            console.log(`Connected to database at host : ${connection_instance.connections[0].host}`);
        }else{
            console.log("Unable to connect to database ready state is not 1");
        }   
    } catch (error) {
        throw error
              
    }
}