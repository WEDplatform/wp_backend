import 'dotenv/config'
import { connectDB } from './src/db/db.js';
import { createServer } from "http"
import { Server } from 'socket.io';
import { app } from './src/app.js';
import { MongoClient } from 'mongodb';
import { createAdapter } from '@socket.io/mongo-adapter';
import { dbname } from './src/constants.js';
import { populateMessage } from './src/controllers/common.controller.js';
const mongo_uri=`${process.env.MONGO_URI}/${dbname}`
const collection_name="chatspfp"
const mongoClient = new MongoClient(mongo_uri);
// ✅ Use `createServer` so both API and Socket.io share the same server
const server = createServer(app); 
// ✅ Attach Socket.io to the same server
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:3000",
            "https://wed-frontend.vercel.app",
            "https://wed-frontend.onrender.com",
        ],
        credentials: true,
    },
});
(async () => {
    await mongoClient.connect();
    console.log("✅ Connected to MongoDB for Socket.io Adapter");

    const db = mongoClient.db();
    const collection = db.collection(collection_name);

    // ✅ Attach MongoDB Adapter to sync messages across multiple servers
    io.adapter(createAdapter(collection));
})();
const nameSpac = io.of('/chatpen')
// ✅ Handle Socket.io Connections
nameSpac.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on('join_room', (payload) => {
        socket.join(payload)
        socket.room = payload; // ✅ Attach room to socket object
        console.log(`${socket.id} joined room: ${payload}`);

    })
    socket.on('sendMessage',async(payload)=>{
        console.log("Received Message:", payload); 
        await populateMessage(payload)
        if (socket.room) {
            nameSpac.to(socket.room).emit("recieveMessage", payload.payload); // ✅ Emit to the correct room
        } else { 
            console.log("Error: User is not in a room!");
        }
    })
    // Handle user disconnection
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});
connectDB()
    .then(() => {
        server.listen(process.env.PORT || 5173, () => {
            console.log(`🚀 Server is running at port ${process.env.PORT || 5173}`);
        })
    })
    .catch((err) => {
        console.log(`MONGODB CONNECTION ERROR`, err);
    })
export { io }
