"use client";

import React, { useState } from "react";
import { uploadFile } from "./utils/api";

export default function Home() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false); // State to track loading

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true); // Show loading spinner
    try {
      const result = await uploadFile(file);
      setSummary(result.summary); // Assuming the API returns the summary
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    setLoading(false); // Hide loading spinner
  };

  const renderSummary = () => {
    if (!summary) return null;

    return summary.split("\n").map((section, index) => {
      const cleanedSection = section.trim(); // Clean up extra spaces

      // Detect main headings (like "Data Loss", "Account or Service Hijacking", etc.)
      if (/^[A-Z][a-z]+/.test(cleanedSection) && cleanedSection.endsWith(":")) {
        return (
          <h2 key={index} className="summary-heading">
            {cleanedSection.slice(0, -1)} {/* Remove the colon from the heading */}
          </h2>
        );
      }

      // Detect bullet points or numbered lists
      if (/^\d+\.\s/.test(cleanedSection) || cleanedSection.startsWith("-")) {
        return (
          <ul key={index} className="summary-list">
            <li>{cleanedSection.replace(/^\d+\.\s*|-/, "").trim()}</li>
          </ul>
        );
      }

      // Subheading for mitigation techniques
      if (cleanedSection.startsWith("Mitigation:")) {
        return (
          <h3 key={index} className="summary-subheading">
            {cleanedSection}
          </h3>
        );
      }

      // Regular paragraph content
      return (
        <p key={index} className="summary-paragraph">
          {cleanedSection}
        </p>
      );
    });
  };

  return (
    <div className="container">
      <h1 className="title">PDF Summarizer</h1>
      
      <form onSubmit={handleSubmit} className="upload-form">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="file-input"
        />
        
        {!loading && (
          <button type="submit" className="submit-button">
            Upload and Summarize
          </button>
        )}

        {loading && (
          <div className="loading-spinner"></div> // Show loading spinner
        )}
      </form>

      {summary && (
        <div className="summary-container">
          <h2 className="summary-title">Summary:</h2>
          {renderSummary()}
        </div>
      )}
    </div>
  );
}
