import { MotionValue, useMotionValue } from "framer-motion";
import { createContext, ReactChild } from "react";

//creating context for x & y coordinates
export const roomContext = createContext<{
    x: MotionValue<number>;
    y: MotionValue<number>;
}>(null!);

const RoomContextProvider = ({ children }: { children: ReactChild }) => {

    const x = useMotionValue(0);
    const y = useMotionValue(0);
//motion values to context consumers
    return (
        <roomContext.Provider value={{ x, y }}>
            {children}
        </roomContext.Provider>
    );
};
export default RoomContextProvider;