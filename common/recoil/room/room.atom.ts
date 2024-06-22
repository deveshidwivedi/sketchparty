import { atom } from "recoil";

export const roomAtom = atom({
    key: "room",
    default: {
        id: "",
        users: new Map(),
        movesWithoutUser: [],
        myMoves: [],
    },
});