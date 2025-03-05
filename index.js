import 'dotenv/config'
import { connectDB } from './src/db/db.js';
import {createServer} from "http"
import { Server } from 'socket.io';
import { app } from './src/app.js';
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
const nameSpac=io.of('/chatpen')
// ✅ Handle Socket.io Connections
nameSpac.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
  
    // Listen for messages from client
    socket.on("message", (msg) => {
      console.log("Received:", msg);
      nameSpac.emit("message", msg); // Broadcast to all users
    });
  
    // Handle user disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
connectDB()
.then(()=>{
    server.listen(process.env.PORT || 5173,()=>{
        console.log(`Server is running at port ${process.env.PORT || 5173}`);
    })
})
.catch((err)=>{ 
    console.log(`MONGODB CONNECTION ERROR`,err);
})
export {io}
