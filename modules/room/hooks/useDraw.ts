import { useOptionsValue } from "@/common/recoil/options";
import { useState, useEffect, useCallback} from "react";
import { useBoardPosition } from "./useBoardPosition";
import { socket } from "@/common/lib/socket";
import { drawAllMoves } from "../helpers/Canvas.helpers";
import { getPos } from "@/common/lib/getPos";
import { useMyMoves, useRoom } from "@/common/recoil/room";



let tempMoves: [number, number][] = [];

const setCtxOptions= (ctx: CanvasRenderingContext2D, options: CtxOptions)=> {
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    (ctx.lineWidth = options.lineWidth), (ctx.strokeStyle= options.lineColor);
    if(options.erase) ctx.globalCompositeOperation = "destination-out";
};

export const useDraw = (
    ctx: CanvasRenderingContext2D | undefined,
    blocked: boolean,
) => {
    const room=useRoom();
    const {handleRemoveMyMove, handleAddMyMove} = useMyMoves();
   
    const [drawing, setDrawing] = useState(false);

    const boardPosition = useBoardPosition();
    const movedX = boardPosition.x;
    const movedY = boardPosition.y;

    const options = useOptionsValue();

    useEffect(() => {
        if (ctx) {
            setCtxOptions(ctx, options);
        }
    });

    useEffect(()=> {
        socket.on("your_move", (move)=>{
            handleAddMyMove(move);
        });

        return ()=> {
            socket.off("your_move");
        };
    });

    const handleUndo = useCallback(() => {
        if (ctx) {
            handleRemoveMyMove();
            socket.emit("undo");

        }
    }, [ctx, handleRemoveMyMove]);

    useEffect(() => {
        const handleUndoKeyboard = (e: KeyboardEvent) => {
            if (e.key === 'z' && e.ctrlKey) {
                handleUndo();
            }
        };

        document.addEventListener('keydown', handleUndoKeyboard);
        return () => {
            document.removeEventListener('keydown', handleUndoKeyboard);
        };
    }, [handleUndo]);

    const handleStartDrawing = (x: number, y: number) => {
        if (!ctx || blocked) return;

        setDrawing(true);

        ctx.beginPath();
        ctx.lineTo(getPos(x, movedX), getPos(y, movedY));
        ctx.stroke();

        tempMoves = [[getPos(x, movedX), getPos(y, movedY)]];
    };

    const handleDraw = (x: number, y: number, shift?:boolean ) => {
        if (!ctx || !drawing || blocked) return;

        if(shift){
            tempMoves= tempMoves.slice(0,1);
            drawAllMoves(ctx, room);
            setCtxOptions(ctx, options)

            ctx.beginPath();
            ctx.lineTo(tempMoves[0][0], tempMoves[0][1]);
            ctx.lineTo(getPos(x, movedX), getPos(y, movedY));   
            ctx.stroke();
            ctx.closePath();

            tempMoves.push([getPos(x, movedX), getPos(y, movedY)]);
            return ;
        }

        ctx.lineTo(getPos(x, movedX), getPos(y, movedY));
        ctx.stroke();
        tempMoves.push([getPos(x, movedX), getPos(y, movedY)]);
    };

    const handleEndDrawing = () => {
        if (!ctx || blocked) return;
        ctx.closePath();
        setDrawing(false);

        const move: Move = {
            path: tempMoves,
            options,
            timestamp: 0,
            eraser: options.erase,
        };

        tempMoves = [];
        ctx.globalCompositeOperation= "source-over"

        socket.emit("draw", move);

         
    };

   

    return {
        handleEndDrawing,
        handleDraw,
        handleStartDrawing,
        handleUndo,
        drawing,
    }
};