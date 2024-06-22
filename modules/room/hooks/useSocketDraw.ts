import { useEffect } from "react";
import { socket } from "@/common/lib/socket"; 

import { handleMove } from "../helpers/Canvas.helpers";

import { useSetUsers } from "@/common/recoil/room";


// Hook to listen for user draw & undo events
export const useSocketDraw = (
    ctx: CanvasRenderingContext2D | undefined,
    drawing: boolean, 
) => {
    const {handleAddMoveToUser, handleRemoveMoveFromUser}= useSetUsers();

    useEffect(() => {
        let movesToDrawLater: Move | undefined;
        let userIdLater = "";
        socket.on("user_draw", (move, userId) => {
            if (ctx && !drawing) {
               handleAddMoveToUser(userId, move);
            } else {
                movesToDrawLater = move;
                userIdLater = userId;
            }
        });

        return () => {
            socket.off("user_draw");

            if (movesToDrawLater && userIdLater && ctx) {
                handleMove(movesToDrawLater, ctx);
                handleAddMoveToUser(userIdLater, movesToDrawLater);
            }
        };
    }, [ctx, drawing, handleAddMoveToUser]);

    useEffect(() => {
        socket.on("user_undo", (userId) => {
            handleRemoveMoveFromUser(userId);
        });
        return () => {
            socket.off("user_undo");
        };
    }, [ctx, handleRemoveMoveFromUser]);

};
