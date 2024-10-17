// app/page.js
"use client"; // Add this at the top of the file

import React, { useState } from "react";
import { uploadFile } from "./utils/api";

export default function Home() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    try {
      const result = await uploadFile(file);
      setSummary(result.summary); // Assuming the API returns the summary in the "summary" field
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div>
      <h1>PDF Summarizer</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <button type="submit">Upload and Summarize</button>
      </form>
      {summary && (
        <div>
          <h2>Summary:</h2>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}
