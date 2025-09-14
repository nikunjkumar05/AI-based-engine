// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import ProfileCard from './ProfileCard';
import Skills from './Skills';
// Assuming you have a Timeline component, otherwise remove it
// import Timeline from './Timeline'; 
import './Dashboard.css';

function Dashboard() {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCandidateData = async () => {
      // In a real app, this ID would come from the URL or user session.
      // For now, you must get an ID from your MongoDB database and paste it here.
      const candidateId = "68c7307d6fa8a08b0b13c5f9";

      if (candidateId === "68c7307d6fa8a08b0b13c5f9") {
        setError("Please update Dashboard.js with a real candidate ID from your MongoDB.");
        return;
      }
      
      try {
        const response = await fetch(`http://127.0.0.1:8000/candidates/${candidateId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setProfileData(data);
      } catch (e) {
        setError("Failed to fetch candidate data. Is the backend server running?");
        console.error(e);
      }
    };

    fetchCandidateData();
  }, []); // The empty array ensures this runs only once when the component mounts

  if (error) {
    return <div className="dashboard-loading"><p style={{color: 'red'}}>{error}</p></div>;
  }

  if (!profileData) {
    return (
      <div className="dashboard-loading">
        <p>Loading profile data...</p>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-page-container">
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Candidate Profile Dashboard</h2>
      <div className="dashboard-grid">
        <ProfileCard
          name={profileData.name}
          jobTitle={profileData.jobTitle}
          location={profileData.location}
          profilePicture={profileData.profilePicture}
          bio={profileData.bio}
        />
        <Skills skills={profileData.skills} />
        {/* If you have a Timeline component, you can add it back here */}
        {/* <Timeline title="Education" items={profileData.education} /> */}
        {/* <Timeline title="Experience" items={profileData.experience} /> */}
      </div>
    </div>
  );
}

export default Dashboard;