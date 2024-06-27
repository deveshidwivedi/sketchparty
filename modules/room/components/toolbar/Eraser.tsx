import { useOptions, useSetOptions } from "@/common/recoil/options";
import {FaEraser} from "react-icons/fa";

const Eraser = () => {
       //may cause error
  const options = useOptions(); 
  const setOptions = useSetOptions();
    return (
        <button
        className={`text-xl ${options.erase && "bg-blue-400"}`}
        onClick={()=> {
            setOptions((prev)=> ({...prev, erase: !prev.erase}))
        }}
        >
            <FaEraser />
        </button>
    );
};

export default Eraser;