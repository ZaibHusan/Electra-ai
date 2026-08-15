// src/services/socket.service.js
import { io } from "socket.io-client";
const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || "http://82.180.133.170:4000";

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});