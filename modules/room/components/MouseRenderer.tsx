import { socket } from "@/common/lib/socket";
import { useEffect, useState } from "react";
import UserMouse from "./UserMouse";
import { useUserIds } from "@/common/recoil/users";

export const MouseRenderer = () => {
    const userIds = useUserIds();

    return (
        <>
            {userIds.map((userId) => (
                <UserMouse userId={userId} key={userId} />
            ))}
        </>
    );
};

export default MouseRenderer;