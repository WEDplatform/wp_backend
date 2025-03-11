import { Server } from "socket.io";
import { createServer } from "http";
import { app } from "../src/app.js";

export const server = createServer(app);
export const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:3000",
            "https://wed-frontend.vercel.app",
            "https://wed-frontend.onrender.com",
        ],
        credentials: true,
    },
});