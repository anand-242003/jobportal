import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app.js";
import dotenv from "dotenv";
import { initializeSocketHandlers } from "./utils/socketHandlers.js";

dotenv.config();
const PORT = process.env.PORT || 5001;

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.io with CORS configuration
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL || "https://your-vercel-app.vercel.app"
];

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"]
  }
});

// Initialize socket event handlers
initializeSocketHandlers(io);

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.io server ready`);
});

// Export io instance for use in other modules
export { io };
