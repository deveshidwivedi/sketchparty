import { socket } from "@/common/lib/socket";
import { useRoom } from "@/common/recoil/room";

import UserMouse from "./UserMouse";


export const MouseRenderer = () => { 

    const {users} = useRoom ();
    return (
        <>
            {[...users.keys()].map((userId) => {
                if (userId === socket.id) return null;
             return (
                 <UserMouse 
                 userId={userId}  
                />
             );
})}
        </>
    );
};

export default MouseRenderer;