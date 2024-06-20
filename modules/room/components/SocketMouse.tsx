import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BsCursorFill } from "react-icons/bs";

const SocketMouse = ({ socketId, cursorPosition }: { socketId: string, cursorPosition: { x: number, y: number } }) => {
    const [pos, setPos] = useState({ x: -1, y: -1 });

    useEffect(() => {
        setPos(cursorPosition);
    }, [cursorPosition]);

    return (
        <motion.div
            className={`absolute top-0 left-0 text-blue-800 ${pos.x === -1 && 'hidden'}`}
            animate={{ x: pos.x, y: pos.y }}
            transition={{ duration: 0.3, ease: "linear" }}
        >
            <BsCursorFill className="-rotate-90" />
        </motion.div>
    );
};

export default SocketMouse;
