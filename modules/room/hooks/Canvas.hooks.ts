import { useCallback, useEffect, useState } from "react";
import { socket } from "@/common/lib/socket";
import { useOptions } from "@/common/recoil/options";
import { drawOnUndo } from "../helpers/Canvas.helpers";
import  { useUsers } from "@/common/recoil/users";
import { useBoardPosition } from "./useBoardPosition";
import { getPos } from "@/common/lib/getPos";


const savedMoves: [number, number][][]= [];
let moves: [number, number][]= [];

export const useDraw = (
    ctx: CanvasRenderingContext2D | undefined,
    blocked: boolean,
    handleEnd: () => void
) => {
    const users = useUsers();
    const options = useOptions();
    const [drawing, setDrawing] = useState(false);

    const boardPosition= useBoardPosition();
    const movedX = boardPosition.x;
    const movedY = boardPosition.y;

    useEffect(()=>{
    if(ctx){
        ctx.lineJoin= "round";
        ctx.lineCap= "round";
        ctx.lineWidth= options.lineWidth;
        ctx.strokeStyle= options.lineColor;
    }
    });

    const handleUndo = useCallback(()=> {
        if(ctx){
            savedMoves.pop();
            //may cause error
            socket.emit("undo");
            
            drawOnUndo(ctx, savedMoves, users);
            handleEnd();
        }
    }, [ctx, handleEnd, users]);

    useEffect (()=>{
        const handleUndoKeyboard = (e: KeyboardEvent) => {
            if(e.key === 'z' && e.ctrlKey){
                handleUndo();
            }
        }

        document.addEventListener('keydown', handleUndoKeyboard);
        return () => {
            document.removeEventListener('keydown', handleUndoKeyboard);
        
        };
    }, [handleUndo]);

    const handleStartDrawing = (x: number, y: number) =>{
    if(!ctx || blocked) return ;

    setDrawing(true);

    ctx.beginPath();
    ctx.lineTo(getPos(x, movedX), getPos(x, movedY));
    ctx.stroke();
    };
    const handleEndDrawing = () =>{
    if(!ctx || blocked) return ;
    setDrawing(false);
    ctx.closePath();

        savedMoves.push(moves);
    

        socket.emit("draw", moves, options);
        moves=[];
        handleEnd();
    };
    const handleDraw= (x:number, y:number) =>{
        if(!ctx ||  !drawing || blocked){
            return;
        }
    
        ctx.lineTo(getPos(x,movedX), getPos(y, movedY));
        ctx.stroke();
        moves.push([getPos(x,movedX), getPos(y, movedY)]);
    };

    return {
        handleEndDrawing,
        handleDraw,
        handleStartDrawing,
        drawing,
    }

    };