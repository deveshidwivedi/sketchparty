import { useRoom} from "@/common/recoil/room";

import RoomContextProvider from "../context/Room.context";
import Canvas from "./Canvas";
import { MousePosition } from "./MousePosition";
import MouseRenderer from "./MouseRenderer";
import { ToolBar } from "./toolbar/ToolBar";
import NameInput from "./NameInput";
import UsersList from "./UsersList";



const Room = () => {
    const room = useRoom();
    if(!room.id) return <NameInput />

     return (
        <RoomContextProvider>
            <div className="relative h-full w-full overflow-hidden">
            <UsersList />
            <ToolBar />
            <Canvas />
            <MousePosition />
            <MouseRenderer />
            </div>
        </RoomContextProvider>
     );
};
export default Room;