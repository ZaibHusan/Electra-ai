import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
    // 1. Initialize Socket.io with CORS allowing your React frontend
    io = new Server(server, {
        cors: {
            origin: "*", // For local testing. In prod, use "http://localhost:5173"
            methods: ["GET", "POST"]
        }
    });

    // 2. Listen for connections
    io.on("connection", (socket) => {
        console.log("🟢 Frontend Client Connected:", socket.id);

        // When a React client loads, they join the "admin_dashboard" room
        socket.on("join_dashboard", () => {
            socket.join("admin_dashboard");
            console.log(`Admin ${socket.id} joined the dashboard room`);
        });

        socket.on("disconnect", () => {
            console.log("🔴 Frontend Client Disconnected:", socket.id);
        });
    });

    return io;
};

// Helper function to use 'io' in other files (like webhooks)
export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io has not been initialized!");
    }
    return io;
};