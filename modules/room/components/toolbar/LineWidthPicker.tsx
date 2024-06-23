import { useOptions, useSetOptions } from "@/common/recoil/options";
import { AnimatePresence, motion } from "framer-motion";
import {useRef, useState} from "react";
import { BsBorderWidth } from "react-icons/bs";
import { useClickAway } from "react-use";

const LineWidthPicker = () => {
      //may cause error
  const options = useOptions(); 
  const setOptions = useSetOptions();

    const ref= useRef<HTMLDivElement>(null);
    const [opened, setOpened] = useState(false);
    useClickAway(ref, () => setOpened(false));

   
        return (
            <div className="relative flex items-center" ref={ref}>
                <button className="text-xl" onClick={() => setOpened(!opened)}>
                    <BsBorderWidth />
                </button>
                <AnimatePresence>
                    {opened && (
                        <motion.div
                            className="absolute top-[6px] left-14 w-36"
                            initial="from"
                            animate="to"
                            exit="from"
                        >
                            <input
                                type="range"
                                min={1}
                                max={20}
                                value={options.lineWidth}
                                //may cause error
                                onChange={(e) => {
                                    setOptions((prev: CtxOptions) => ({
                                        ...prev,
                                        lineWidth: parseInt(e.target.value, 10)
                                    }));
                                }}
                                className="h-4 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };
    
    export default LineWidthPicker;