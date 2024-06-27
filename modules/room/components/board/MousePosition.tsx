import { useRef } from "react";
import { useBoardPosition } from "../../hooks/useBoardPosition";
import { useInterval, useMouse } from "react-use";
import { socket } from "@/common/lib/socket";
import { motion } from "framer-motion";
import { getPos } from "@/common/lib/getPos";

// To track and emit mouse position changes via socket
export const MousePosition = () => {
    const prevPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const { x, y } = useBoardPosition();
    const ref = useRef<HTMLDivElement>(null);

    const { docX, docY } = useMouse(ref);

    useInterval(() => {
        if (prevPosition.current.x !== docX || prevPosition.current.y !== docY) {
            socket.emit("mouse_move", getPos(docX,x), getPos(docY, y));
            prevPosition.current = { x: docX, y: docY };
        }
    }, 25);

    return (
        <motion.div
            ref={ref}
            className="pointer-events-none absolute top-2 left-0 z-50"
            animate={{ x: docX + 15, y: docY + 15 }}
            transition={{ duration: 0.05, ease: "linear" }}
        >
            {getPos(docX, x).toFixed(0)} | {getPos(docY, y).toFixed(0)}
        </motion.div>
    );
};