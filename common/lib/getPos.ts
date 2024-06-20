import { MotionValue } from "framer-motion";

export const getPos = (pos: number, motionValue: MotionValue): number => {
  return pos - motionValue.get();
};
