import React, { type FormEvent } from "react";

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

function MainApp() {
  const [username, setUsername] = React.useState("");
  const [userLanguage, setUserLanguage] = React.useState<langs>("null");
  const [partnerLanguage, setPartnerLanguage] = React.useState<langs>("null");

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
};

function BasicForm({
  username,
  setUsername,
  userLang,
  setUserLang,
  partnerLang,
  setPartnerLang,
}: BasicFormProps) {
  let ready: boolean;

  if (username.length === 0 || userLang === "null" || partnerLang === "null") {
    ready = false;
  } else {
    ready = true;
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(username, userLang);
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
            className="border border-black"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 mb-2">
          <label htmlFor="lang">select ur language</label>
          <select
            name="lang"
            id="lang"
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
          <label htmlFor="lang">partner language</label>
          <select
            name="lang"
            id="lang"
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
