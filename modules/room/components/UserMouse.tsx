import { useEffect, useState } from "react";
import { useBoardPosition } from "../hooks/useBoardPosition";
import { socket } from "@/common/lib/socket";
import { motion } from "framer-motion";
import { BsCursorFill } from "react-icons/bs";

//cursor issue
const UserMouse = ({ userId }: { userId: string }) => {
    const boardPos = useBoardPosition();
    const [x, setX] = useState(boardPos.x.get());
    const [y, setY] = useState(boardPos.y.get());
    const [pos, setPos] = useState({ x: -1, y: -1 });

    useEffect(() => {
        const handleMouseMove = (newX: number, newY: number, socketIdMoved: string) => {
            if (socketIdMoved === userId) {
                setPos({ x: newX, y: newY });
            }
        };

        socket.on("mouse_moved", handleMouseMove);
        return () => {
            socket.off("mouse_moved", handleMouseMove);
        };
    }, [userId]);

    useEffect(() => {
        const unsubscribe = boardPos.x.onChange(setX);
        return unsubscribe;
    }, [boardPos.x]);

    useEffect(() => {
        const unsubscribe = boardPos.y.onChange(setY);
        return unsubscribe;
    }, [boardPos.y]);

    return (
        <motion.div
            className={`absolute top-0 left-0 text-blue-800 ${pos.x === -1 ? 'hidden' : ''} pointer-events-none`}
            animate={{ x: pos.x + x, y: pos.y + y }}
            transition={{ duration: 0.3, ease: "linear" }}
        >
            <BsCursorFill className="-rotate-90" />
        </motion.div>
    );
};

export default UserMouse;