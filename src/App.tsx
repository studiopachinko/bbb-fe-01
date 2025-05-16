import React, { useEffect, useRef, type FormEvent } from "react";
import { io, type Socket } from "socket.io-client";

export default function App() {
  return (
    <main className="place-content-center place-items-center bg-stone-300 h-[100vh]">
      <MainApp />
    </main>
  );
}

type langs = "null" | "en" | "es";

const languageOptions: Record<langs, string> = {
  null: "Choose a language",
  en: "English",
  es: "Spanish",
};

const SOCKET_SERVER_URL = "http://localhost:4000";

function MainApp() {
  const [username, setUsername] = React.useState("");
  const [userLanguage, setUserLanguage] = React.useState<langs>("null");
  const [partnerLanguage, setPartnerLanguage] = React.useState<langs>("null");

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (socketRef) {
      socketRef.current = io(SOCKET_SERVER_URL);
      console.log("hello");
      socketRef.current.on("socketAndSee", (data) => console.log(data));
      socketRef.current.emit("thanks", "thanks! so much lol!");
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

    socketRef.current?.emit("newRoom", {
      roomData: retrievedData,
      socketId: socketRef.current.id,
    });
  };

  return (
    <div className="min-w-[400px] p-2 bg-white max-w-[400px] min-h-[800px] max-h-[800px]">
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
