import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { socket } from '@/common/lib/socket';

const Home = () => {
    const [roomId, setRoomId] = useState("");
    const router = useRouter();

    useEffect(() => {
        const handleCreated = (roomIdFromServer: string) => {
            router.push(roomIdFromServer);
        };

        const handleJoined = (roomIdFromServer: string, failed?: boolean) => {
            if (!failed) {
                router.push(roomIdFromServer);
            } else {
                console.log("Failed to join room");
            }
        };

        socket.on("created", handleCreated);
        socket.on("joined", handleJoined);

        return () => {
            socket.off("created", handleCreated);
            socket.off("joined", handleJoined);
        };
    }, [router]);

    const handleCreateRoom = () => {
        socket.emit("create_room");
    };

    const handleJoinRoom = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        socket.emit("join_room", roomId);
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 text-navy-800">
            <h1 className="mt-24 text-6xl font-extrabold leading-tight drop-shadow-lg">
                SketchParty
            </h1>
            <h3 className="text-2xl mt-4">Sketching and Fun for Everyone!</h3>

            <form className="mt-8 flex flex-col items-center gap-4" onSubmit={handleJoinRoom}>
                <label htmlFor="room-id" className="w-full text-center self-start text-lg font-bold leading-tight">
                    Enter Room ID
                </label>
                <input
                    className="rounded-full border-none p-4 py-2 text-navy-800 text-center shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                    id="room-id"
                    placeholder="Enter Room ID"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                />
                <button
                    className="rounded-full bg-teal-500 px-8 py-2 text-white text-lg font-semibold transition-all hover:scale-105 active:scale-100 shadow-lg"
                    type="submit"
                >
                    Join Room
                </button>
            </form>

            <div className="mt-8 flex flex-col items-center gap-4">
                <h5 className="self-start text-lg font-bold leading-tight">
                    Create a New Room
                </h5>
                <button
                    className="rounded-full bg-teal-500 px-8 py-2 text-white text-lg font-semibold transition-all hover:scale-105 active:scale-100 shadow-lg"
                    onClick={handleCreateRoom}
                >
                    Create Room
                </button>
            </div>

            <footer className="mt-auto mb-8 text-sm">
                <p>© 2024 SketchParty. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
