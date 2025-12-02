import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app.js";
import dotenv from "dotenv";
import { initializeSocketHandlers } from "./utils/socketHandlers.js";

dotenv.config();
const PORT = process.env.PORT || 5001;

// Validate required env vars
if (!process.env.FRONTEND_URL) {
  console.error("❌ ERROR: FRONTEND_URL environment variable is required");
  process.exit(1);
}

const httpServer = createServer(app);

const allowedOrigins = [process.env.FRONTEND_URL];

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"]
  }
});
initializeSocketHandlers(io);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.io server ready`);
  console.log(`🌐 Allowed origin: ${process.env.FRONTEND_URL}`);
});

export { io };
