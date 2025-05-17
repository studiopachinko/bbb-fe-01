import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { QRCodeSVG } from "qrcode.react";
import React, { useEffect, useRef, useState, type FormEvent } from "react";
import { io, Socket } from "socket.io-client";

interface RoomMetaData {
  username: string;
  userLanguage: string;
  partnerLanguage: string;
}

interface Room {
  owner: string;
  partner: string | null;
  metadata: RoomMetaData;
}

interface newRoomData {
  roomName: string;
  roomMetaData: RoomMetaData;
  socketId: string;
}

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <MainApp />;
}

type langs = "null" | "en" | "es";

const languageOptions: Record<langs, string> = {
  null: "Choose a language",
  en: "English",
  es: "Spanish",
};

// const SOCKET_SERVER_URL = "http://localhost:4000";
const SOCKET_SERVER_URL = `${window.location.protocol}//${window.location.hostname}:4000`;
const VITE_DEV_SERVER = `${window.location.protocol}//${window.location.hostname}:5173`;

function MainApp() {
  const [username, setUsername] = useState("");
  const [userLanguage, setUserLanguage] = useState<langs>("null");
  const [partnerLanguage, setPartnerLanguage] = useState<langs>("null");
  const [showQRCodeModal, setShowQRCodeModal] = useState<boolean>(false);
  const [newRoomName, setNewRoomName] = useState<string | null>(null);
  const [partnerJoining, setPartnerJoining] = useState<boolean>(false);
  const socketRef = useRef<Socket | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (socketRef) {
      socketRef.current = io(SOCKET_SERVER_URL);
      console.log("hello");
      socketRef.current.on("socketAndSee", (data) => console.log(data));
      socketRef.current.emit("thanks", "thanks! so much lol!");
      // listen for roomCreate
      // create QR code that points to /join?=
      socketRef.current.on("roomCreated", (data) => {
        setShowQRCodeModal(true);
      });

      socketRef.current.on("partnerJoining", () => {
        setPartnerJoining(true);
      });

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

  const handleSubmitForm = (formData: FormData) => {
    const retrievedData: BasicFormData = {
      username: formData.get("username") as string,
      userLanguage: formData.get("userLanguage") as langs,
      partnerLanguage: formData.get("partnerLanguage") as langs,
    };

    const roomName = socketRef.current?.id + "-room";

    socketRef.current?.emit("newRoom", {
      roomName: roomName,
      roomMetadata: retrievedData,
      socketId: socketRef.current.id,
    });

    setNewRoomName(roomName);
  };

  return (
    <>
      <div>
        <h1 className="font-medium">BlaBlaBla</h1>
      </div>
      <BasicForm
        username={username}
        setUsername={setUsername}
        userLang={userLanguage}
        setUserLang={setUserLanguage}
        partnerLang={partnerLanguage}
        setPartnerLang={setPartnerLanguage}
        onSubmitForm={handleSubmitForm}
      />
      {showQRCodeModal && (
        <JoinRoomQRCodeModal>
          {newRoomName && (
            <div className="flex flex-col items-center justify-center gap-4">
              {!partnerJoining ? (
                <>
                  <QRCodeSVG
                    value={`${VITE_DEV_SERVER}/join?roomName=${newRoomName}`}
                  />
                  <Link to="/join" search={{ roomName: newRoomName }}>
                    Room Link
                  </Link>
                </>
              ) : (
                <div className="size-32 bg-emerald-400 text-white text-center place-content-center">
                  Partner is joining. PLS B PATIENT OKAY?
                </div>
              )}
            </div>
          )}
        </JoinRoomQRCodeModal>
      )}
    </>
  );
}

function JoinRoomQRCodeModal({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 z-10 bg-black/20 p-4">
      <div className="bg-white flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}

type BasicFormProps = {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  userLang: langs;
  setUserLang: React.Dispatch<React.SetStateAction<langs>>;
  partnerLang: langs;
  setPartnerLang: React.Dispatch<React.SetStateAction<langs>>;
  onSubmitForm: (formData: FormData) => void;
};

type BasicFormData = {
  username: string;
  userLanguage: langs;
  partnerLanguage: langs;
};

function BasicForm({
  username,
  setUsername,
  userLang,
  setUserLang,
  partnerLang,
  setPartnerLang,
  onSubmitForm,
}: BasicFormProps) {
  let ready: boolean;

  if (username.length === 0 || userLang === "null" || partnerLang === "null") {
    ready = false;
  } else {
    ready = true;
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmitForm(formData);
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
        <div className="flex flex-col gap-2 mb-4">
          <label htmlFor="partnerLanguage">partner language</label>
          <select
            name="partnerLanguage"
            id="partnerLanguage"
            className="border border-black"
            value={partnerLang}
            onChange={(e) => setPartnerLang(e.target.value as langs)}
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
