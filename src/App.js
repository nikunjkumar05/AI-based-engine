import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file!");
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post("http://127.0.0.1:8000/parse_resume/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setParsedData(res.data);
  };

  return (
    <div className="container">
      <h2>Resume Parser</h2>

      <div className="upload-section">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload Resume</button>
      </div>

      {parsedData && (
        <div className="result-card">
          <h3>Extracted Information</h3>
          <p><strong>Name:</strong> {parsedData.name}</p>
          <p><strong>Email:</strong> {parsedData.contact.email}</p>
          <p><strong>Phone:</strong> {parsedData.contact.phone}</p>
          <p><strong>Experience:</strong> {parsedData.experience}</p>
          <p><strong>Education:</strong> {parsedData.education.join(", ")}</p>

          <div>
            <strong>Skills:</strong>
            <div className="skills">
              {parsedData.skills.map((skill, i) => (
                <span key={i} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
