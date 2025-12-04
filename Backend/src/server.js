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

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_PRODUCTION
].filter(Boolean);

const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      // Allow requests with no origin or from allowed origins or Vercel previews
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
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
