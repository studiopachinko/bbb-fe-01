import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";

interface ChatSearchParams {
  roomName: string;
}

const SOCKET_SERVER_URL = `${window.location.protocol}//${window.location.hostname}:4000`;
const VITE_DEV_SERVER = `${window.location.protocol}//${window.location.hostname}:5173`;

export const Route = createFileRoute("/chat")({
  validateSearch: (search: ChatSearchParams) => {
    return {
      roomName: search.roomName || "",
    };
  },
  component: ChatRoute,
});

type userRoles = "owner" | "partner";

interface RoomMetaData {
  username: string;
  userLanguage: string;
  partnerLanguage: string;
}

interface Room {
  roomName: string;
  owner: string;
  partner: string;
  partnerName: string;
  metadata: RoomMetaData;
}

function ChatRoute() {
  const [role, setRole] = useState<userRoles | null>(null);
  const [isInterloper, setIsInterloper] = useState(false);
  const [chatData, setChatData] = useState<Room | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const { roomName } = Route.useSearch();

  useEffect(() => {
    if (socketRef) {
      socketRef.current = io(SOCKET_SERVER_URL);

      socketRef.current.emit("chatInit", roomName);

      socketRef.current.on("chatStart", (data: Room) => {
        if (socketRef.current?.id === data.owner) {
          setRole("owner");
        } else if (socketRef.current?.id === data.partner) {
          setRole("partner");
        } else {
          setIsInterloper(true);
        }

        setChatData(data);
      });
    }

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return (
    <div>
      {!isInterloper ? (
        <>
          <h1>You are chatting!</h1>
          <p>You are the room {role === "owner" ? role : "partner"}</p>
          <p>
            You are chatting with{" "}
            {role === "owner"
              ? chatData?.partnerName
              : chatData?.metadata.username}
          </p>
          {role === "owner" && (
            <button className="bg-red-500 text-white h-10">CANCEL CHAT</button>
          )}
        </>
      ) : (
        <div className="bg-red-400 text-white">
          error: not supposed to be here
        </div>
      )}
    </div>
  );
}
