import { socket } from "@/common/lib/socket";
import { useEffect, useState } from "react";
import SocketMouse from "./SocketMouse";

const MouseRenderer = () => {
    const [remoteCursors, setRemoteCursors] = useState<{ [key: string]: { x: number, y: number } }>({});

    useEffect(() => {
        socket.on("mouse_moved", (newX, newY, socketIdMoved) => {
            setRemoteCursors(prevState => ({
                ...prevState,
                [socketIdMoved]: { x: newX, y: newY }
            }));
        });

        return () => {
            socket.off("mouse_moved");
        };
    }, []);

    return (
        <>
            {Object.keys(remoteCursors).map((socketId) => (
                <SocketMouse key={socketId} socketId={socketId} cursorPosition={remoteCursors[socketId]} />
            ))}
        </>
    );
};

export default MouseRenderer;
