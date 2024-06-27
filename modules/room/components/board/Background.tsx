import { useEffect, useRef } from "react";
import { useBoardPosition } from "../../hooks/useBoardPosition";
import {motion} from "framer-motion";
import { CANVAS_SIZE } from "@/common/constants/canvasSize";

const Background = () => {
    const {x,y} = useBoardPosition();
    const ref= useRef<HTMLCanvasElement>(null);

    useEffect(()=> {
        const ctx= ref.current?.getContext("2d");

        if(ctx){
            ctx.fillStyle="#fff";
            ctx.fillRect(0,0,CANVAS_SIZE.width, CANVAS_SIZE.height);
            ctx.lineWidth=1;
            ctx.strokeStyle="#ccc";

            
    for(let i=0;i<CANVAS_SIZE.height;i+=25){
        ctx.beginPath();
        ctx.moveTo(0,i);
        ctx.lineTo(CANVAS_SIZE.width,i);
        ctx.stroke(); 
      }
      for(let i=0;i<CANVAS_SIZE.width;i+=25){
        ctx.beginPath();
        ctx.moveTo(i,0);
        ctx.lineTo(i, CANVAS_SIZE.height);
        ctx.stroke(); 
      }
        }
    },[]);
    return (
        <motion.canvas
        ref={ref}
        width={CANVAS_SIZE.width}
        height={CANVAS_SIZE.height}
        className="absolute top-0 bg-zinc-100"
        style={{x,y}}
        />
    );
};

export default Background;