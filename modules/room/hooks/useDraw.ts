import { useOptions } from "@/common/recoil/options";
import { useUsers } from "@/common/recoil/users";
import { useState, useEffect, useCallback} from "react";
import { useBoardPosition } from "./useBoardPosition";
import { socket } from "@/common/lib/socket";
import { drawAllMoves } from "../helpers/Canvas.helpers";
import { getPos } from "@/common/lib/getPos";
import { useMyMoves } from "@/common/recoil/room";



let tempMoves: [number, number][] = [];

export const useDraw = (
    ctx: CanvasRenderingContext2D | undefined,
    blocked: boolean,
) => {
    const {handleRemoveMyMove, handleAddMyMove} = useMyMoves();
   
    const [drawing, setDrawing] = useState(false);

    const boardPosition = useBoardPosition();
    const movedX = boardPosition.x;
    const movedY = boardPosition.y;

    const options = useOptions();

    useEffect(() => {
        if (ctx) {
            ctx.lineJoin = "round";
            ctx.lineCap = "round";
            ctx.lineWidth = options.lineWidth;
            ctx.strokeStyle = options.lineColor;
        }
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

    const handleDraw = (x: number, y: number) => {
        if (!ctx || !drawing || blocked) return;

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
            options
        };

        handleAddMyMove(move);
        tempMoves = [];

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