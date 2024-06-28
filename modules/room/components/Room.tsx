import { useRoom} from "@/common/recoil/room";

import RoomContextProvider from "../context/Room.context";
import Canvas from "./board/Canvas";
import { MousePosition } from "./board/MousePosition";
import MouseRenderer from "./board/MouseRenderer";
import { ToolBar } from "./toolbar/ToolBar";
import NameInput from "./NameInput";
import UsersList from "./UsersList";
import { useRef } from "react";
import Chat from "./chat/Chat";



const Room = () => {
    const room = useRoom();

    if(!room.id) return <NameInput />;

     return (
        <RoomContextProvider>
            <div className="relative h-full w-full overflow-hidden">
            <UsersList />
            <ToolBar />
            <Canvas />
            <MousePosition />
            <MouseRenderer />
            <Chat />
            </div>
        </RoomContextProvider>
     );
};
export default Room;