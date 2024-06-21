
import { createServer } from "http";
import {} from "@/common/types/global"
import express from "express";
import next, { NextApiHandler } from "next";
import {Server} from "socket.io";

const port= parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const nextApp= next({ dev });
const nextHandler= nextApp.getRequestHandler();

nextApp.prepare().then(async() =>{
const app= express();
const server= createServer(app);
const io= new Server<ClientToServerEvents, ServerToClientEvents>(server);

app.get("/hello", async(_, res)=>{
    res.send("Hello ji!");
});

io.on("connection", (socket)=>{
    console.log("connection");

    const allUsers= io.sockets.adapter.rooms.get("global");
        if (allUsers) io.to("global").emit("users_in_room", [...allUsers]);

    socket.on("draw", (move)=>{
        console.log("drawing");
        socket.broadcast.emit("user_draw", move, socket.id);
    });

    socket.on("mouse_move", (x,y) => {
        console.log("mouse move");
        socket.broadcast.emit("mouse_moved", x, y, socket.id);
    
    });

    socket.on("undo", ()=>{
        console.log("undo");
        socket.broadcast.emit("user_undo", socket.id);
    });

    socket.on("disconnect", ()=>{
        console.log("disconnected");
    });

});

app.all("*", (req, res) => nextHandler(req, res));
server.listen(port, () =>{
    console.log(`Server is ready on ${port}`);
});
});