import { io } from "socket.io-client";

let socket = null;

export const initializeSocket = () => {
    if (socket?.connected) {
        return socket;
    }

    const socketURL = process.env.NEXT_PUBLIC_SOCKET_URL;
    
    if (!socketURL) {
        throw new Error("Socket URL not configured. Please set NEXT_PUBLIC_SOCKET_URL in your environment variables.");
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    socket = io(socketURL, {
        withCredentials: true,
        autoConnect: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 10,
        timeout: 10000,
        transports: ['websocket', 'polling'],
        auth: token ? { token } : {}
    });

    socket.on("disconnect", (reason) => {
        if (reason === 'io server disconnect') {
            socket.connect();
        }
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
    }
};
