import {useRecoilValue} from "recoil";
import {optionsAtom} from "./options.atoms";

export const useOptions = () => {
const options= useRecoilValue(optionsAtom);
return options;
};