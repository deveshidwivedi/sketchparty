import { CANVAS_SIZE } from "@/common/constants/canvasSize";
import { useViewportSize } from "@/common/hooks/useViewportSize";
import { useMotionValue, motion } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { useKeyPressEvent } from "react-use";
import { useDraw } from "../../hooks/useDraw";
import { useSocketDraw } from "../../hooks/useSocketDraw";
import { socket } from "@/common/lib/socket";
import Minimap from "./Minimap";
import { useRoom } from "@/common/recoil/room";
import { useMovesHandlers } from "../../hooks/useMovesHandlers";
import { useBoardPosition } from "../../hooks/useBoardPosition";
import Background from "./Background";
import { useOptionsValue } from "@/common/recoil/options";
import { useRefs } from "../../hooks/useRefs";

const Canvas = () => {
    const room = useRoom();
    const options = useOptionsValue();
    const { canvasRef, bgRef, undoRef } = useRefs(); // Call the hook as a function
    const smallCanvasRef = useRef<HTMLCanvasElement>(null);

    const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
    const [dragging, setDragging] = useState(false);
    const [, setMovedMiniMap] = useState(false);

    const { width, height } = useViewportSize();
    const { x, y } = useBoardPosition();

    const {handleUndo, drawAllMoves} = useMovesHandlers();

    useKeyPressEvent("Control", (e) => {
        if (e.ctrlKey && !dragging) {
            setDragging(true);
        }
    });

    const { handleEndDrawing, handleDraw, handleStartDrawing, drawing} = useDraw(dragging, drawAllMoves);

    useSocketDraw(ctx, drawing);

    useEffect(() => {
        const newCtx = canvasRef.current?.getContext("2d");
        if (newCtx) setCtx(newCtx);

        const handleKeyUp = (e: KeyboardEvent) => {
            if (!e.ctrlKey && dragging) {
                setDragging(false);
            }
        }
        window.addEventListener("keyup", handleKeyUp);

        const undoBtn = undoRef.current;
        undoBtn?.addEventListener("click", handleUndo);

        return () => {
            window.removeEventListener("keyup", handleKeyUp);
            undoBtn?.removeEventListener("click", handleUndo);
        }
    }, [dragging, handleUndo, undoRef, canvasRef]);

    useEffect(() => {
        if (ctx) socket.emit("joined_room");
    }, [ctx]);

    return (
        <div className="relative h-full w-full overflow-hidden">
            <motion.canvas
                ref={canvasRef}
                width={CANVAS_SIZE.width}
                height={CANVAS_SIZE.height}
                className={`absolute top-0 z-10 ${dragging && 'cursor-move'}`}
                style={{ x, y }}
                drag={dragging}
                dragConstraints={{
                    left: -(CANVAS_SIZE.width - width),
                    right: 0,
                    top: -(CANVAS_SIZE.height - height),
                    bottom: 0,
                }}
                dragElastic={0}
                dragTransition={{ power: 0, timeConstant: 0 }}

                onMouseDown={(e) => {
                    handleStartDrawing(
                        e.clientX,
                        e.clientY
                    )
                }}
                onMouseUp={handleEndDrawing}
                onMouseMove={(e) => {
                    handleDraw(
                        e.clientX,
                        e.clientY,
                        e.shiftKey
                    );
                }}

                onTouchStart={(e) => {
                    handleStartDrawing(
                        e.changedTouches[0].clientX,
                        e.changedTouches[0].clientY
                    );
                }}
                onTouchEnd={handleEndDrawing}
                onTouchMove={(e) => {
                    handleDraw(
                        e.changedTouches[0].clientX,
                        e.changedTouches[0].clientY
                    );
                }}
            />
            <Background bgRef={bgRef} />
            <Minimap
                dragging={dragging}
                setMovedMiniMap={setMovedMiniMap}
            />
        </div>
    )
};

export default Canvas;
