import { Inter } from "next/font/google";
import Canvas from "@/modules/room/components/Canvas";


const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    return <Canvas />;
}
