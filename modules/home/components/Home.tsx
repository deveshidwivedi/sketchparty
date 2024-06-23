import { FormEvent, useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { socket } from '@/common/lib/socket';

import { useSetRoomId } from '@/common/recoil/room';

import NotFoundModal from '../modals/NotFound';

import { useModal } from '@/common/recoil/modal';

const Home = () => {
    const [roomId, setRoomId] = useState("");
    const [username, setUsername] = useState("");
    const setAtomRoomId = useSetRoomId();

    const router = useRouter();

    const {openModal} = useModal();

    useEffect(() => {
        const handleCreated = (roomIdFromServer: string) => {
           setAtomRoomId(roomIdFromServer);
            router.push(roomIdFromServer);
        };

        const handleJoinedRoom = (roomIdFromServer: string, failed?: boolean) => {
            if (!failed) {
                setAtomRoomId(roomIdFromServer);
                router.push(roomIdFromServer);
            } else {
                openModal(<NotFoundModal id={roomId} />)
            }
        };
        socket.on("created", handleCreated);
        socket.on("joined", handleJoinedRoom);


        return () => {
            socket.off("created", handleCreated);
            socket.off("joined", handleJoinedRoom);
        };
    }, [openModal, roomId, router, setAtomRoomId]);

    const handleCreateRoom = () => {
        socket.emit("create_room", username);
    };

    const handleJoinRoom = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        socket.emit("join_room", roomId, username);
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 text-navy-800">
            <h1 className="mt-9 text-6xl font-extrabold leading-tight drop-shadow-lg">
                SketchParty
            </h1>
            <h3 className="text-2xl mt-4">Sketching and Fun for Everyone!</h3>

            <div className='mt-8 flex flex-col gap-3 items-center'>
    <label className='text-center leading-tight text-lg font-bold'>Enter Your Name</label>
    <input
        className='rounded-full border-none p-4 py-2 text-navy-800 text-center shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400'
        id='room-id'
        placeholder='Username'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
    />
</div>

        
            <form className=" mt-3 flex flex-col items-center gap-3" onSubmit={handleJoinRoom}>
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

        <div className='my-5 flex w-96 items-center gap-2'>
        <div className='h-px w-full bg-zinc-200'  />
        <p className='text-zinc-400'>OR</p>
        <div className='h-px w-full bg-zinc-200'  />
        </div>


            <div className="mt-1 mb-4 flex flex-col items-center gap-2">
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

           
        </div>
    );
};

export default Home;
