"use client";

import { useState } from "react";

const ScriptTextArea = () => {
  const [titleScript, setTitleScript] = useState("");
  const [scriptText, setScriptText] = useState("");

  // handle save script
  const handleSaveScript = async () => {
    if (titleScript === "") {
      alert("title is required");
      return;
    }
    const response = await fetch("/api/scripts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title_script: titleScript,
        text_script: scriptText,
      }), // TODO: compare object fields names with backend
    });

    const result = await response.json();
    console.log("the result is: " + result);
    alert("script saved");
    setTitleScript("");
    setScriptText("");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleScript(e.target.value);
  };

  const handlescriptTextChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setScriptText(e.target.value);
  };

  return (
    <>
      <div className="p-5 text-center bg-green-900 flex flex-col items-center gap-4">
        <input
          type="text"
          placeholder="title of script"
          className="border-1 w-full max-w-md flex-grow p-4"
          onChange={handleTitleChange}
          value={titleScript}
        />
        <textarea
          className="border-1 w-full p-4 max-w-md flex-grow"
          rows={20}
          placeholder="script text"
          onChange={handlescriptTextChange}
          value={scriptText}
        ></textarea>
        <div className="flex justify-center">
          <button
            className="border px-6 text-3xl hover:bg-gray-700 hover:cursor-pointer max-w-[200px]"
            onClick={() => handleSaveScript()}
          >
            save script
          </button>
        </div>
      </div>
    </>
  );
};

export default ScriptTextArea;
