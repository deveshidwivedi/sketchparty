import { Inter } from "next/font/google";
import Room from "@/modules/room/components/Room";


const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    return <Room />;
}
