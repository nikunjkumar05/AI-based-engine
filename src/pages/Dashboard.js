import React, { useState, useEffect } from 'react';
import ProfileCard from '../components/ProfileCard'; // Correct import path
import Skills from '../components/Skills';           // Correct import path
import Timeline from '../components/Timeline';       // Correct import path
import './Dashboard.css'; // Add a CSS file for Dashboard styling

function Dashboard() {
  const [profileData, setProfileData] = useState(null); // Initial state is null

  useEffect(() => {
    // Simulate fetching user profile data from an API
    setTimeout(() => {
      const fetchedProfile = {
        name: "Sangeetha K.",
        email: "sangeetha@example.com",
        jobTitle: "Aspiring Data Scientist",
        location: "Bengaluru, India",
        profilePicture: "https://via.placeholder.com/100", // Placeholder
        bio: "Passionate about AI/ML and making an impact.",
        
        // --- IMPORTANT: Ensure these are ARRAYS or objects you INTEND to convert ---
        skills: ["Python", "SQL", "Machine Learning", "React", "Data Analysis", "Cloud Computing (AWS)"],
        
        // Example 1: Education data as an array (ideal)
        education: [
          { degree: "B.Tech in CS", institution: "ABC University", year: "2020 - 2024" },
          { degree: "High School Diploma", institution: "XYZ School", year: "2020" }
        ],

        // Example 2: Experience data as an array (ideal)
        experience: [
          { role: "Data Science Intern", company: "Innovate AI", duration: "Summer 2023" },
          { role: "Web Development Intern", company: "WebTech Solutions", duration: "Spring 2022" }
        ],

        // Example 3: If an API returns 'education' as an object (LESS IDEAL, but handled below)
        // education_as_object: {
        //   item1: { degree: "B.Tech in CS", institution: "ABC University", year: "2020 - 2024" },
        //   item2: { degree: "High School Diploma", institution: "XYZ School", year: "2020" }
        // },
      };
      setProfileData(fetchedProfile);
    }, 1500); // Simulate network delay
  }, []);

  if (!profileData) {
    return (
      <div className="dashboard-loading">
        <p>Loading profile data...</p>
        {/* Optional: Add a spinner */}
        <div className="spinner"></div>
      </div>
    );
  }

  // --- Data Transformation for Timeline Components ---
  // This is the crucial part to prevent "items.map is not a function"
  // If 'profileData.education' is an object, convert it to an array.
  // Otherwise, use it as is.
  const educationItems = Array.isArray(profileData.education)
    ? profileData.education
    : (profileData.education ? Object.values(profileData.education) : []); // Handles object or null/undefined

  const experienceItems = Array.isArray(profileData.experience)
    ? profileData.experience
    : (profileData.experience ? Object.values(profileData.experience) : []); // Handles object or null/undefined


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
        <Timeline title="Education" items={educationItems} /> {/* Pass processed items */}
        <Timeline title="Experience" items={experienceItems} /> {/* Pass processed items */}
      </div>
    </div>
  );
}

export default Dashboard;