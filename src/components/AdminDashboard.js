import React from 'react';
import './AdminDashboard.css'; // Create this CSS file

function AdminDashboard() {
  // Dummy data for the charts
  const candidateDistribution = {
    rural: 38,
    urban: 62,
  };

  const internshipAllocation = [
    { sector: 'Healthcare', percentage: 10 }, // Changed percentages for visual variety
    { sector: 'IT', percentage: 30 },
    { sector: 'Manufacturing', percentage: 20 },
    { sector: 'Others', percentage: 40 },
  ];

  const internshipSeatUtilization = 87; // Percentage

  const fairnessChecks = {
    ruralParticipation: { value: 38, goal: 30, met: true },
    femaleParticipation: { value: 42, goal: 35, met: true },
    underrepresentedCategories: { status: 'Some categories underrepresented', met: false },
  };

  return (
    <div className="admin-dashboard-container">
      <div className="top-bar">
        <div className="ministry-info">
          <img src="https://via.placeholder.com/30" alt="Ministry Logo" /> {/* Placeholder */}
          <span>Ministry of Skill Development & Entrepreneurship</span>
        </div>
        <div className="admin-profile">
          <img src="https://via.placeholder.com/30" alt="Admin User" /> {/* Placeholder */}
          <span>Admin User</span>
          <span className="notification-icon">🔔</span>
        </div>
      </div>

      <div className="admin-grid">
        <div className="card analytics-card">
          <h4>Candidate Distribution</h4>
          <div className="chart-container pie-chart">
            {/* Simple representation of a pie chart using CSS or text */}
            <div className="pie-slice rural" style={{ '--percentage': candidateDistribution.rural, '--color': '#4CAF50' }}>
              Rural {candidateDistribution.rural}%
            </div>
            <div className="pie-slice urban" style={{ '--percentage': candidateDistribution.urban, '--color': '#007bff' }}>
              Urban {candidateDistribution.urban}%
            </div>
            <div className="pie-legend">
                <span style={{'--legend-color': '#4CAF50'}}>Rural {candidateDistribution.rural}%</span>
                <span style={{'--legend-color': '#007bff'}}>Urban {candidateDistribution.urban}%</span>
            </div>
          </div>
        </div>

        <div className="card analytics-card">
          <h4>Internship Allocation by Sector</h4>
          <div className="chart-container bar-chart">
            {internshipAllocation.map((data, index) => (
              <div key={index} className="bar-item">
                <div className="bar-label">{data.sector}</div>
                <div className="bar" style={{ height: `${data.percentage * 2}px` }}> {/* Scale for visual */}
                  {data.percentage}%
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card analytics-card">
          <h4>Internship Seat Utilization</h4>
          <div className="gauge-chart-container">
            <div className="gauge" style={{ '--utilization': internshipSeatUtilization }}>
                <div className="gauge-fill"></div>
                <div className="gauge-cover"></div>
                <div className="gauge-value">{internshipSeatUtilization}%</div>
            </div>
            <p>Overall seat utilization across industries.</p>
          </div>
        </div>

        <div className="card analytics-card">
          <h4>Fairness Monitoring</h4>
          <div className="fairness-checks">
            <p>
              <span className={fairnessChecks.ruralParticipation.met ? 'status-icon green' : 'status-icon yellow'}>
                {fairnessChecks.ruralParticipation.met ? '✅' : '⚠️'}
              </span>
              Rural participation: {fairnessChecks.ruralParticipation.value}% (Goal: {fairnessChecks.ruralParticipation.goal}%)
            </p>
            <p>
              <span className={fairnessChecks.femaleParticipation.met ? 'status-icon green' : 'status-icon yellow'}>
                {fairnessChecks.femaleParticipation.met ? '✅' : '⚠️'}
              </span>
              Female participation: {fairnessChecks.femaleParticipation.value}% (Goal: {fairnessChecks.femaleParticipation.goal}%)
            </p>
            <p>
              <span className={fairnessChecks.underrepresentedCategories.met ? 'status-icon green' : 'status-icon yellow'}>
                {fairnessChecks.underrepresentedCategories.met ? '✅' : '⚠️'}
              </span>
              {fairnessChecks.underrepresentedCategories.status} <a href="#" style={{marginLeft: '5px'}}>View Details</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;