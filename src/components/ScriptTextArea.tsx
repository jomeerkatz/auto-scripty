"use client";

import { useState } from "react";

/**
 * ScriptTextArea Component
 * 
 * Provides a form interface for creating and saving scripts.
 * Users can input a title and script text, then save it to the backend.
 * 
 * Features:
 * - Title input validation (required field)
 * - Large textarea for script content
 * - Save functionality that persists to database
 * - Form reset after successful save
 */
const ScriptTextArea = () => {
  const [titleScript, setTitleScript] = useState("");
  const [scriptText, setScriptText] = useState("");

  /**
   * Handles saving the script to the backend.
   * Validates that a title is provided before submitting.
   * Clears the form after successful save.
   */
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
      }),
    });

    const result = await response.json();
    console.log("the result is: " + result);
    alert("script saved");
    
    // Reset form after successful save
    setTitleScript("");
    setScriptText("");
  };

  /**
   * Handles changes to the title input field
   */
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleScript(e.target.value);
  };

  /**
   * Handles changes to the script text textarea
   */
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
