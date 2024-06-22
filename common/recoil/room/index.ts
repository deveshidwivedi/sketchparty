import { roomAtom } from "./room.atom";
import { useRoom, useMyMoves, useSetUsers, useRoomId, useSetRoomId } from "./room.hooks";

export default roomAtom;

export { useRoomId, useSetRoomId, useRoom, useMyMoves, useSetUsers};