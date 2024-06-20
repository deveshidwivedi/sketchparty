import { useEffect, useState } from "react";
import { useBoardPosition } from "../hooks/useBoardPosition";
import {socket} from "@/common/lib/socket";
import {motion } from "framer-motion";
import {BsCursorFill} from "react-icons/bs";

const SocketMouse = ({socketId}: {socketId:string}) => {
    //board postn
    const boardPos= useBoardPosition();
    const [x, setX]= useState(boardPos.x.get());
    const [y, setY]= useState(boardPos.y.get());

    const [pos, setPos] = useState({x:-1, y:-1});

    useEffect(()=>{
        socket.on("mouse_moved", (newX, newY, socketIdMoved) => {
            if(socketIdMoved === socketId){
                setPos({x: newX, y: newY});
            }
        });
    }, [socketId]);

    //update x position when board position x changes
    useEffect(()=>{
        const unsubscribe= boardPos.x.onChange(setX);
        return unsubscribe;

    }, [boardPos.x]);

    //update y position when board position y changes
    useEffect(()=>{
        const unsubscribe= boardPos.y.onChange(setY);
        return unsubscribe;

    }, [boardPos.y]);

return (
    <motion.div className="{`absolute top-0 left-0 text-blue-800 ${
    pos.x === -1 && 'hidden'
    }`}"
        animate={{x: pos.x+x, y: pos.y+y}}
        transition={{duration: 0.3, ease: "linear"}}
        >
        <BsCursorFill className="-rotate-90" />
    </motion.div>
)
};
export default SocketMouse;