import { useRef } from "react";
import { useBoardPosition } from "../hooks/useBoardPosition";
import { useInterval, useMouse } from "react-use";
import {socket} from "@/common/lib/socket";
import {motion} from "framer-motion";

export const MousePosition = () => {
    //setting initial values as 0
    const prevPosition = useRef<{x:number, y:number}>({x:0, y:0});
    const {x,y} = useBoardPosition();
    const ref= useRef<HTMLDivElement>(null);

    const {docX, docY} = useMouse(ref);

    useInterval(()=>{
        if(prevPosition.current.x !== docX || prevPosition.current.y !== docY){
            socket.emit("mouse_move", docX- x.get(), docY- y.getY());
            prevPosition.current = {x:docX, y:docY};
        }
    }, 300);

    return (
        <motion.div
        ref={ref}
        className="absolute top-2 left-0 z-50 select-none"
        animate={{x:docX+15, y:docY+15}}
        transition={{duration:0.05, ease:"linear"}}
        >
        {docX - x.get()} | {docY - y.get()}
        </motion.div>
    )

}