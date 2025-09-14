import React, { useState } from 'react';
import './CompanyDashboard.css';

const CompanyDashboard = () => {
  const [internshipPosted, setInternshipPosted] = useState(false);
  const [newInternship, setNewInternship] = useState({
    title: '',
    requiredSkills: '',
    noOfInterns: '',
    location: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInternship((prev) => ({ ...prev, [name]: value }));
  };

  const handlePostInternship = (e) => {
    e.preventDefault();
    console.log('Posting Internship:', newInternship);
    setInternshipPosted(true);
    // In a real app, you'd send this to your backend and then
    // probably clear the form or show a confirmation.
    setNewInternship({
      title: '',
      requiredSkills: '',
      noOfInterns: '',
      location: '',
    });
    setTimeout(() => setInternshipPosted(false), 3000); // Hide success message after 3 seconds
  };

  const candidates = [
    {
      id: 1,
      name: 'Rahul Sharma',
      fitScore: 92,
      skills: ['Python', 'SQL'],
      categories: ['Rural Category Bonus'],
    },
    {
      id: 2,
      name: 'Ayesha Khan',
      fitScore: 88,
      skills: ['AI', 'ML'],
      categories: ['First-time applicant', 'Female'], // Added Female
    },
    {
      id: 3,
      name: 'Ravi Patel',
      fitScore: 84,
      skills: ['JavaScript', 'React'],
      categories: [], // No special categories for this one
    },
    {
      id: 4,
      name: 'Priya Singh',
      fitScore: 90,
      skills: ['Cloud Computing', 'DevOps'],
      categories: ['Rural Category Bonus', 'Female'],
    },
  ];

  const handleShortlist = (candidateId) => {
    alert(`Shortlisted candidate ID: ${candidateId}`);
  };

  return (
    <div className="company-dashboard-container">
      <div className="top-bar">
        <h1>Company Dashboard</h1>
        <div className="company-info">
          <img src="https://via.placeholder.com/30" alt="Company Logo" />
          <span>TATA Innovations</span>
          <span className="hr-manager">HR Manager</span>
        </div>
      </div>

      <div className="card post-internship-card">
        <h2>Post Internship</h2>
        <form onSubmit={handlePostInternship}>
          <div className="form-group">
            <input
              type="text"
              name="title"
              placeholder="Internship Title (e.g., Data Analyst Intern)"
              value={newInternship.title}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="requiredSkills"
              placeholder="Required Skills (comma-separated: Python, SQL)"
              value={newInternship.requiredSkills}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              name="noOfInterns"
              placeholder="No. of Interns"
              value={newInternship.noOfInterns}
              onChange={handleInputChange}
              min="1"
              required
            />
            <input
              type="text"
              name="location"
              placeholder="Location (e.g., Bengaluru or Remote)"
              value={newInternship.location}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="post-btn">Post Internship</button>
          {internshipPosted && <p className="success-message">Internship Posted Successfully!</p>}
        </form>
      </div>

      <h2 className="section-title">Best-fit Candidates</h2>
      <div className="candidate-list">
        {candidates.map((candidate) => (
          <div key={candidate.id} className="card candidate-tile">
            <div className="candidate-info">
              <h3>{candidate.name}</h3>
              <div className="fit-score">
                <span>{candidate.fitScore}%</span>
                {candidate.fitScore >= 90 && <span className="check-icon">✅</span>}
              </div>
            </div>
            <div className="candidate-tags">
              {candidate.skills.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
              {candidate.categories.map((category, index) => (
                <span key={index} className={`category-badge ${category.toLowerCase().replace(/ /g, '-')}`}>
                  {category}
                </span>
              ))}
            </div>
            <button className="shortlist-btn" onClick={() => handleShortlist(candidate.id)}>Shortlist</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyDashboard;