import { socket } from "@/common/lib/socket";
import { useSetRoomId } from "@/common/recoil/room";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";



const NameInput = () => {
    const setRoomId= useSetRoomId();
    const [name, setName]= useState("");
    const router= useRouter();
    const roomId= (router.query.roomId || "").toString();

    useEffect(()=> {
        if(!roomId) return;
        socket.emit("check_room", roomId);
        socket.on("room_exists", (exists)=> {
            console.log("room exists", exists);
            if(!exists){
                router.push("/");
            }
        });
        return () => {
            socket.off("room_exists");
        };
    }, [roomId, router]);

    useEffect(()=> {
        const handleJoined= (roomIdFromServer: string, failed?: boolean) => {
            if(failed) router.push("/");
            else setRoomId(roomIdFromServer);
        };
        socket.on("joined", handleJoined);

        return () => {
            socket.off("joined", handleJoined);
        };

    }, [router, setRoomId]);
    const handleJoinRoom= (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        socket.emit("join_room", roomId, name);
    };

    return (
        <form className="flex flex-col items-center" onSubmit={handleJoinRoom}>
            <h1 className="mt-24 text-extra font-extrabold leading-tight">SketchParty</h1>
            <h3 className="text-2xl">Sketching and Fun for everyone</h3>
        <div className="mt-8 mb-6 flex flex-col gap-2">
            <label className="self-start font-bold leading-tight">Enter Your Name</label>
            <input className="rounded-xl border p-5 py-1" id="room-id" placeholder="Username" value={name} onChange={(e)=> setName(e.target.value)}></input>
        </div>

        <button
                    className="rounded-full bg-teal-500 px-8 py-2 text-white text-lg font-semibold transition-all hover:scale-105 active:scale-100 shadow-lg"
                    type="submit"
                >
                    Enter Room
                </button>

        </form>
    );
};

export default NameInput;