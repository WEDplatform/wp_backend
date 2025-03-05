import 'dotenv/config'
import { connectDB } from './src/db/db.js';
import { createServer } from "http"
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
const nameSpac = io.of('/chatpen')
// ✅ Handle Socket.io Connections
nameSpac.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on('join_room', (payload) => {
        socket.join(payload)
        socket.room = payload; // ✅ Attach room to socket object
        console.log(`${socket.id} joined room: ${payload}`);

    })
    socket.on('sendMessage',(payload)=>{
        console.log("Received Message:", payload);
        
        if (socket.room) {
            nameSpac.to(socket.room).emit("recieveMessage", payload); // ✅ Emit to the correct room
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
            console.log(`Server is running at port ${process.env.PORT || 5173}`);
        })
    })
    .catch((err) => {
        console.log(`MONGODB CONNECTION ERROR`, err);
    })
export { io }
