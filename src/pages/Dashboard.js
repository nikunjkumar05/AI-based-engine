import React, { useState, useEffect } from 'react';
import ProfileCard from '../components/ProfileCard';
import Skills from '../components/Skills';
import './Dashboard.css';

function Dashboard() {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCandidateData = async () => {
      // Your specific candidate ID has been added here.
      const candidateId = "68c7307d6fa8a08b0b13c5f9";
      
      try {
        // This is the correct URL for your FastAPI backend endpoint
        const response = await fetch(`http://127.0.0.1:8000/candidates/${candidateId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || `HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setProfileData(data);

      } catch (e) {
        setError(`Failed to fetch candidate data: ${e.message}`);
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
      </div>
    </div>
  );
}

export default Dashboard;