import React from 'react';
import './Skills.css'; // Create this CSS file

function Skills({ skills = [] }) { // Default to empty array for safety
  return (
    <div className="skills-card section-card">
      <h4>Skills</h4>
      <div className="skills-list">
        {skills.length > 0 ? (
          skills.map((skill, index) => (
            <span key={index} className="skill-tag">{skill}</span>
          ))
        ) : (
          <p>No skills listed yet.</p>
        )}
      </div>
    </div>
  );
}

export default Skills;