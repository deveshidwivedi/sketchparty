import { useEffect, useState } from "react";
import { socket } from "@/common/lib/socket";

let moves: [number, number][] = [];

export const useDraw = (
  options: CtxOptions,
  ctx?: CanvasRenderingContext2D
) => {
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    if (ctx) {
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.lineWidth = options.lineWidth;
      ctx.strokeStyle = options.lineColor;
    }
  });

  const handleStartDrawing = (x: number, y: number) => {
    if (!ctx) return;

    moves = [[x, y]];
    setDrawing(true);

    ctx.beginPath();
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  const handleEndDrawing = () => {
    if (!ctx) return;
    const move: Move = {
      width: 0,
      height: 0,
      radius: 0,
      path: moves,
      options,
      timestamp: 0,
      eraser: options.erase,
      base64: "",
    };
    socket.emit("draw", move);
    setDrawing(false);
    ctx.closePath();
  };
  const handleDraw = (x: number, y: number) => {
    if (ctx && drawing) {
      moves.push([x, y]);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  return {
    handleEndDrawing,
    handleDraw,
    handleStartDrawing,
    drawing,
  };
};
