import { io } from "socket.io-client";

let socket = null;

export const initializeSocket = () => {
    if (socket?.connected) {
        console.log("Socket already connected");
        return socket;
    }

    const socketURL = process.env.NEXT_PUBLIC_SOCKET_URL;
    
    if (!socketURL) {
        console.error("❌ NEXT_PUBLIC_SOCKET_URL is not configured");
        throw new Error("Socket URL not configured. Please set NEXT_PUBLIC_SOCKET_URL in your environment variables.");
    }

    socket = io(socketURL, {
        withCredentials: true,
        autoConnect: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 10,
        timeout: 10000,
        transports: ['websocket', 'polling']
    });

    socket.on("connect", () => {
        console.log("✅ Socket connected:", socket.id);
    });

    socket.on("connect_error", (error) => {
        if (socket.io.engine.transport) {
            console.warn("⚠️ Socket connection error:", error.message);
        }
    });

    socket.on("disconnect", (reason) => {
        console.log("🔌 Socket disconnected:", reason);
        if (reason === 'io server disconnect') {
            socket.connect();
        }
    });

    socket.on("reconnect", (attemptNumber) => {
        console.log("🔄 Socket reconnected after", attemptNumber, "attempts");
    });

    socket.on("reconnect_attempt", (attemptNumber) => {
        if (attemptNumber === 1) {
            console.log("🔄 Attempting to reconnect...");
        }
    });

    socket.on("reconnect_failed", () => {
        console.error("❌ Socket reconnection failed. Please refresh the page.");
    });

    return socket;
};

export const getSocket = () => {
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
        console.log("Socket disconnected manually");
    }
};
