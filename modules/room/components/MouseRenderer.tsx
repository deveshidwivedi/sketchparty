import {socket} from "@/common/lib/socket";
import {useEffect, useState} from "react";
import SocketMouse from "./SocketMouse";

const MouseRenderer = () => {
    // store socket ids of remote users
    const [mouses, setMouses] = useState<string[]>([]); 
    console.log(mouses);

    //listen for changes in users present in the room
    useEffect(()=>{
        socket.on("users_in_room", (socketIds)=>{
            //to filter own socket id and update state with rem ids
            const allUsers = socketIds.filter((socketId)=> socketId !== socket.id );
            setMouses(allUsers);
        });

        return () =>{
            socket.off("users_in_room");
        };
    },[]);
    return (
        <>
        {mouses.map((socketId)=>{
            return <SocketMouse socketId={socketId} key={socketId}  />;
        })}
        </>
    );
};

export default MouseRenderer;