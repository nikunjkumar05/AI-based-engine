import React from 'react';
import './ProfileCard.css'; // Create this CSS file

function ProfileCard({ name, jobTitle, location, profilePicture, bio }) {
  return (
    <div className="profile-card section-card">
      <img src={profilePicture} alt={`${name}'s profile`} className="profile-picture" />
      <h3>{name}</h3>
      <p className="job-title">{jobTitle}</p>
      <p className="location">{location}</p>
      <p className="bio">{bio}</p>
      {/* Add more profile details as needed */}
    </div>
  );
}

export default ProfileCard;