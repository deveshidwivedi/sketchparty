import { socket } from "@/common/lib/socket";
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

    const setUsers= useSetRecoilState(usersAtom);
    const usersIds= useUserIds();
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // socket events for user join/leave and clean up listeners
    useEffect(()=> {
        socket.on("users_in_room", (newUsers)=>{
            newUsers.forEach((user)=> {
                if(!usersIds.includes(user) && user !== socket.id){
                    setUsers((prevUsers)=> ({...prevUsers, [user]:[] }));
                }
            
            });
        });
        socket.on("user_disconnected", (userId)=> {
            setUsers((prevUsers)=> {
                const newUsers= {...prevUsers};
                delete newUsers[userId];
                return newUsers;
            });
        });
        return () => {
            socket.off("users_in_room");
            socket.off("user_disconnected");
        };
    }, [setUsers, usersIds]);
//motion values to context consumers
    return (
        <roomContext.Provider value={{ x, y }}>
            {children}
        </roomContext.Provider>
    );
};
export default RoomContextProvider;