"use client";

import { useState } from "react";
import createScriptAction from "@/app/actions/scripts";

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
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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

  const handleSaveScript = async () => {
    try {
      if (titleScript.trim() === "" || scriptText.trim() === "") {
        setErrorMessage("Please fill in all fields");
        return;
      }
      setIsLoading(true);
      setErrorMessage("");
      const result = await createScriptAction({
        titleOfScript: titleScript,
        textOfScript: scriptText,
      });

      if (!result.success) {
        setErrorMessage(
          result.error || "An unknown error occurred while saving the script"
        );
        return;
      }
      setTitleScript("");
      setScriptText("");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="p-5 text-center flex flex-col items-center gap-4">
        <input
          type="text"
          placeholder="title of script"
          className="border-1 w-full max-w-md flex-grow p-4"
          onChange={handleTitleChange}
          value={titleScript}
          disabled={isLoading}
        />
        <textarea
          className="border-1 w-full p-4 max-w-md flex-grow"
          rows={20}
          placeholder="script text"
          onChange={handlescriptTextChange}
          value={scriptText}
          disabled={isLoading}
        ></textarea>
        <div className="flex justify-center">
          <button
            className="border px-6 text-3xl hover:bg-gray-700 hover:cursor-pointer max-w-[200px]"
            onClick={handleSaveScript}
            disabled={isLoading}
          >
            {isLoading ? "saving script..." : "save script"}
          </button>
        </div>
        {errorMessage && <div className="text-red-700">{errorMessage}</div>}
      </div>
    </>
  );
};

export default ScriptTextArea;
