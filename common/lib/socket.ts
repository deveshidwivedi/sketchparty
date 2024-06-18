import {io, Socket} from "socket.io-client";
// to estb websocket connection
export const socket: Socket<ServerToClientEvents, ClientToServerEvents>= io();