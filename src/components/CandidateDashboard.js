import React, { useState } from 'react';
import './CandidateDashboard.css';

const CandidateDashboard = () => {
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [skills, setSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      handleResumeUpload(file); // Trigger upload immediately
    }
  };

  const handleResumeUpload = async (file) => {
    setLoadingSkills(true);
    setResumeUploaded(false); // Reset upload status
    setSkills([]); // Clear previous skills

    const formData = new FormData();
    formData.append('file', file); // 'file' must match the FastAPI parameter name

    try {
      // Check the URL carefully!
      const response = await fetch('http://127.0.0.1:8000/parse_resume/', { // <--- THIS IS THE TARGET URL
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        // Log the full response for more details on non-2xx status codes
        const errorText = await response.text();
        console.error('API Error Response Text:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response (parsed JSON):', data);

      // Assuming the API returns a CandidateProfile object, with skills in 'data.skills'
      // You might need to adjust this if your backend returns a different structure
      if (data && Array.isArray(data.skills)) {
          setSkills(data.skills);
          setResumeUploaded(true);
      } else {
          console.warn("API response did not contain expected 'skills' array:", data);
          setSkills(["No skills extracted or invalid response."]);
          setResumeUploaded(true); // Still show it as uploaded, but with a warning
      }

    } catch (error) {
      console.error('Error uploading resume:', error);
      alert('Failed to upload resume. Please check the backend server. Error: ' + error.message);
    } finally {
      setLoadingSkills(false);
    }
  };

  // ... (rest of your component's state and functions for internships) ...

  return (
    <div className="candidate-dashboard-container">
      {/* ... (top-bar) ... */}

      <div className="card upload-card">
        <h2>Upload Resume</h2>
        {!resumeUploaded || loadingSkills ? ( // Changed condition to include loadingSkills
          <>
            <label htmlFor="resume-upload" className="upload-btn">
              {loadingSkills ? "Uploading..." : "Upload Resume (PDF/DOC)"}
            </label>
            <input
              id="resume-upload"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              disabled={loadingSkills} // Disable input while loading
            />
            {selectedFile && <p style={{marginTop: '10px'}}>Selected file: {selectedFile.name}</p>}
            {loadingSkills && (
              <p className="loading-text">
                <span className="spinner"></span> Extracting Skills...
              </p>
            )}
          </>
        ) : (
          <>
            <p className="success-text">Resume Uploaded Successfully!</p>
            <div className="skills-tags">
              {skills.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
            {/* Option to upload another resume */}
            <button className="upload-btn" onClick={() => {
                setResumeUploaded(false);
                setSelectedFile(null);
                setSkills([]);
            }} style={{marginTop: '15px'}}>Upload New Resume</button>
          </>
        )}
      </div>

      {/* ... (Recommended Internships section) ... */}
    </div>
  );
};

export default CandidateDashboard;