import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  const handleUpload = async () => {
    if (!file) return setError("Please select a file!");
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://127.0.0.1:8000/parse_resume/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setParsedData(res.data);
    } catch (err) {
      setError("Failed to parse resume. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h2>Resume Parser</h2>

      <div className="upload-section">
        <label className="upload-label">
          <input type="file" onChange={handleFileChange} hidden />
          <span className="upload-area">
            {file ? file.name : "Drag & drop or click to select a PDF"}
          </span>
        </label>
        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Uploading..." : "Upload Resume"}
        </button>
      </div>
      {error && <div className="error">{error}</div>}

      {parsedData && (
        <div className="result-card">
          <h3>Extracted Information</h3>
          <p><strong>Name:</strong> {parsedData.name}</p>
          <p><strong>Email:</strong> {parsedData.contact.email || "N/A"}</p>
          <p><strong>Phone:</strong> {parsedData.contact.phone || "N/A"}</p>
          <p><strong>Experience:</strong> {parsedData.experience}</p>
          <p><strong>Education:</strong> {parsedData.education.length ? parsedData.education.join(", ") : "N/A"}</p>
          <div>
            <strong>Skills:</strong>
            <div className="skills">
              {parsedData.skills.length ? parsedData.skills.map((skill, i) => (
                <span key={i} className="skill-tag">{skill}</span>
              )) : <span>N/A</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
