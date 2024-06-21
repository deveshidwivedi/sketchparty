import { createServer } from "http";
import express from "express";
import next from "next";
import { Server } from "socket.io";
import {} from "@/common/types/global";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

nextApp.prepare().then(async () => {
    const app = express();
    const server = createServer(app);
    const io = new Server<ClientToServerEvents, ServerToClientEvents>(server);

    app.get("/hello", async (_, res) => {
        res.send("Hello ji!");
    });

    const rooms = new Map<string, Room>();
    rooms.set("global", new Map());

    const addMove = (roomId: string, socketId: string, move: Move) => {
        const room = rooms.get(roomId);

        if (!room?.has(socketId)) {
            room?.set(socketId, [move]);
        }
        room?.get(socketId)?.push(move);
    };

    const undoMove = (roomId: string, socketId: string) => {
        const room = rooms.get(roomId);
        room?.get(socketId)?.pop();
    };

    io.on("connection", (socket) => {
        console.log("connection");

        socket.join("global");
        rooms.get("global")?.set(socket.id, []);

        io.to(socket.id).emit("joined", JSON.stringify([...rooms.get("global")!]));

        const allUsers = io.sockets.adapter.rooms.get("global");
        if (allUsers) io.to("global").emit("users_in_room", [...allUsers]);

        socket.on("draw", (move) => {
            console.log("drawing");
            addMove("global", socket.id, move);
            socket.broadcast.emit("user_draw", move, socket.id);
        });

        socket.on("undo", () => {
            console.log("undo");
            undoMove("global", socket.id);
            socket.broadcast.emit("user_undo", socket.id);
        });

        socket.on("mouse_move", (x, y) => {
            console.log("mouse move");
            socket.broadcast.emit("mouse_moved", x, y, socket.id);
        });

        socket.on("disconnect", () => {
            console.log("disconnected");
            rooms.get("global")?.delete(socket.id);
            io.to("global").emit("user_disconnected", socket.id);
        });
    });

    app.all("*", (req, res) => nextHandler(req, res));
    server.listen(port, () => {
        console.log(`Server is ready on ${port}`);
    });
});
