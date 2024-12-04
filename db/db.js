import mongoose from "mongoose";
import { dbname } from "../src/constants.js";

export const connectDB=async()=>{
    try {
        let connection_instance=await mongoose.connect(`${process.env.MONGO_URI}/${dbname}`);
        let connection_state=connection_instance.connections[0].readyState
        if(connection_state===1){
            console.log("Connected to database");
        }else{
            console.log("Unable to connect to database");
        }
        
    } catch (error) {
        console.log("Unable to connect to database",error);
        process.exit(1)
        
    }
}