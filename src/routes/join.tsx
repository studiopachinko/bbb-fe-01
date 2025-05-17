import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React, { useEffect, useRef, useState, type FormEvent } from "react";
import { io, type Socket } from "socket.io-client";
import type { langs } from "../../../types"; // !!!???

interface JoinSearchParams {
  roomName: string;
}

const SOCKET_SERVER_URL = `${window.location.protocol}//${window.location.hostname}:4000`;
const VITE_DEV_SERVER = `${window.location.protocol}//${window.location.hostname}:5173`;

export const Route = createFileRoute("/join")({
  validateSearch: (search: JoinSearchParams) => {
    return {
      roomName: search.roomName || "",
    };
  },
  component: JoinPage,
});

function JoinPage() {
  const socketRef = useRef<Socket | null>(null);
  const { roomName } = Route.useSearch();
  const [username, setUsername] = useState("");
  const [userLanguage, setUserLanguage] = useState<langs>("null");
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (socketRef) {
      socketRef.current = io(SOCKET_SERVER_URL);

      setShowForm(true);

      const data = {
        socketId: socketRef.current.id,
        roomName,
      };

      socketRef.current.emit("joinRoom", data);

      socketRef.current.on("chatStarts", (data) => {
        navigate({
          to: `/chat`,
          search: data.roomName,
        });
      });
    }

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return (
    <>
      {showForm && socketRef.current && (
        <BasicForm
          username={username}
          userLang={userLanguage}
          setUsername={setUsername}
          setUserLang={setUserLanguage}
          socket={socketRef.current}
        />
      )}
    </>
  );
}

type BasicFormProps = {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  userLang: langs;
  setUserLang: React.Dispatch<React.SetStateAction<langs>>;
  socket: Socket;
};

function BasicForm({
  username,
  setUsername,
  userLang,
  setUserLang,
  socket,
}: BasicFormProps) {
  const { roomName } = Route.useSearch();
  let ready: boolean;

  if (username.length === 0 || userLang === "null") {
    ready = false;
  } else {
    ready = true;
  }

  const languageOptions: Record<langs, string> = {
    null: "Choose a language",
    en: "English",
    es: "Spanish",
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username");
    const userLanguage = formData.get("userLanguage");

    socket.emit("partnerHasJoined", {
      roomName,
      socketId: socket.id,
      partnerName: username,
      partnerLanguage: userLanguage,
    });
  };

  return (
    <>
      <h2 className="font-medium">START CHATTIN</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2 mb-2">
          <label htmlFor="username">ur display name</label>
          <input
            type="text"
            id="username"
            name="username"
            className="border border-black"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 mb-2">
          <label htmlFor="userLanguage">select ur language</label>
          <select
            name="userLanguage"
            id="userLanguage"
            className="border border-black"
            value={userLang}
            onChange={(e) => setUserLang(e.target.value as langs)}
          >
            {Object.entries(languageOptions).map((option, i) => (
              <option key={i} value={option[0]}>
                {option[1]}
              </option>
            ))}
          </select>
        </div>

        <button
          disabled={!ready}
          className="bg-green-400 disabled:bg-stone-400 h-10 w-full"
        >
          start chat
        </button>
      </form>
    </>
  );
}
