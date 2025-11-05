import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || undefined;

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> =
  SOCKET_URL ? io(SOCKET_URL) : io();
