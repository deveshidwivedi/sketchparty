import { CANVAS_SIZE } from "@/common/constants/canvasSize";
import { useViewportSize } from "@/common/hooks/useViewportSize";
import { MotionValue, useMotionValue } from "framer-motion";
import {Dispatch, SetStateAction, forwardRef, useEffect, useRef} from "react";
import {motion} from "framer-motion";


const Minimap = forwardRef<
HTMLCanvasElement,{
    x: MotionValue<number>;
    y: MotionValue<number>;
    dragging: boolean;
    setMovedMiniMap: Dispatch<SetStateAction<boolean>>;
}
>(({x, y, dragging, setMovedMiniMap}, ref)=>{
    const containerRef = useRef<HTMLDivElement>(null);
    const {width, height} = useViewportSize();

    const miniX = useMotionValue(0);
    const miniY = useMotionValue(0);

    useEffect(()=>{
        miniX.onChange((newX)=>{
            if(!dragging) x.set(-newX * 10);
        });
        miniY.onChange((newY)=>{
            if(!dragging) y.set(-newY * 10);
        });

        return () =>{
          miniX.clearListeners();
          miniY.clearListeners();  
        };

    }, [dragging, miniX, miniY, x, y]);
//the mini version of canvas on top right corner
return (
    <div className="absolute right-10 top-10 z-50 bg-zinc-400" ref={containerRef} style={{
        width: CANVAS_SIZE.width / 10,
        height: CANVAS_SIZE.height / 10,    
    }}>
        <canvas
        ref={ref}
        width={CANVAS_SIZE.width}
        height={CANVAS_SIZE.height}
        className="h-full w-full"
        />
       <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0}
        dragTransition= {{power:0, timeConstant:0}}
        onDragEnd={()=> setMovedMiniMap((prev:boolean)=> !prev)}
        className="absolute top-0 left-0 cursor-grab border-2 border-red-500"
        style={{
            width: width / 10,
            height: height / 10,
            x: miniX,
            y: miniY,
        }}
        animate={{x: x.get() / -10, y: y.get() / -10}}
        transition={{duration: 0.1}}
        >
       </motion.div>
    </div>
)
});

Minimap.displayName = "Minimap";
export default Minimap;