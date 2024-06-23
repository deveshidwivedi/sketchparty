import { socket } from "@/common/lib/socket";
import { useSetRoom, useSetUsers } from "@/common/recoil/room/room.hooks";
import usersAtom, { useUserIds } from "@/common/recoil/users";
import { MotionValue, useMotionValue } from "framer-motion";
import { createContext, ReactChild, useEffect } from "react";
import { useSet } from "react-use";
import { useSetRecoilState } from "recoil";

//creating context for x & y coordinates
export const roomContext = createContext<{
    x: MotionValue<number>;
    y: MotionValue<number>;
}>(null!);

const RoomContextProvider = ({ children }: { children: ReactChild }) => {

     const setRoom = useSetRoom();
     const {handleAddUser, handleRemoveUser} = useSetUsers();
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // socket events for user join/leave and clean up listeners
    useEffect(()=> {

        socket.on("room",(room, usersMovesToParse, usersToParse)=> {
            const usersMoves= new Map< string, Move[]>(JSON.parse(usersMovesToParse));
            const users= new Map< string, string>(JSON.parse(usersToParse))
            setRoom((prev)=>({
                ...prev,
                users,
                usersMoves,
                movesWithoutUser: room.drawed,
            }));
        });

        socket.on("new_user", (userId, username)=> {
            handleAddUser(userId, username);
        });


        socket.on("user_disconnected", (userId)=> {
           handleRemoveUser(userId);
        });
        return () => {
            socket.off("room");
            socket.off("new_user");
            socket.off("user_disconnected");
        };
    }, [handleAddUser, handleRemoveUser, setRoom]);
//motion values to context consumers
    return (
        <roomContext.Provider value={{ x, y }}>
            {children}
        </roomContext.Provider>
    );
};
export default RoomContextProvider;

function useSetUser(): { handleAddUser: any; handleRemoveUser: any; } {
    throw new Error("Function not implemented.");
}
