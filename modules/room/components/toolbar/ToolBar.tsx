import { RefObject } from "react";
import ColorPicker from "./ColorPicker";
import Eraser from "./Eraser";
import LineWidthPicker from "./LineWidthPicker";
import { BsFillChatFill, BsFillImageFill, BsThreeDots } from "react-icons/bs";
import { HiOutlineDownload } from "react-icons/hi";
import { FaUndo } from "react-icons/fa";

export const ToolBar = ({undoRef}: {undoRef: RefObject<HTMLButtonElement>}) => { 
    return (
        <div className="absolute left-10 top-[50%] z-50 flex flex-col items-center rounded-lg gap-5 p-5 bg-zinc-900 text-white"
        style={{
            transform: "translateY(-50%)"
        }}
        >
         <button className="text-xl" ref={undoRef}>
            <FaUndo />
         </button>
         <div className="h-px w-full bg-white" />
            <ColorPicker />
            <LineWidthPicker />
            <Eraser />
         <button className="text-xl">
            <BsFillImageFill />
         </button>
         <button className="text-xl">
            <BsThreeDots />
         </button>
         <button className="text-xl">
            <HiOutlineDownload />
         </button>
        </div>
    );
};