import {useEffect, useState} from "react";

export const useViewportSize = () => {

    const [width, setWidth]= useState(0);
    const [height, setHeight]= useState(0);
 
    useEffect(()=>{
        const handleResize=()=>{
         setWidth(window.innerWidth);
         setHeight(window.innerHeight);
        };
    
        window.addEventListener("resize", handleResize);
        handleResize();
    
        return () => {
          window.removeEventListener("resize", handleResize);
        };
      }, []);
      return {width, height};
};