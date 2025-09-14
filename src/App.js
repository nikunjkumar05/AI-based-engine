import React, { useState } from 'react';
import './App.css'; // For general app styling if any

// Import all page components
import Login from './pages/login.js';
import Dashboard from './pages/Dashboard.js'; // Assuming Dashboard is the main page after login

// Import dashboard components for direct testing if needed
import CandidateDashboard from './components/CandidateDashboard';
import CompanyDashboard from './components/CompanyDashboard';
import AdminDashboard from './components/AdminDashboard'; // Assuming you will create this next

function App() {
  // Simple state to simulate navigation/which dashboard to show
  // For your hackathon, you might hardcode one for the demo
  const [currentPage, setCurrentPage] = useState('candidate'); // 'login', 'dashboard', 'candidate', 'company', 'admin'

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login onLoginSuccess={() => setCurrentPage('dashboard')} />;
      case 'dashboard': // This would typically show the user's specific dashboard
        return <Dashboard />; // Render a generic dashboard or conditional render based on user type
      case 'candidate':
        return <CandidateDashboard />;
      case 'company':
        return <CompanyDashboard />;
      case 'admin':
        return <AdminDashboard />; // Will be created soon
      default:
        return <Login onLoginSuccess={() => setCurrentPage('dashboard')} />;
    }
  };

  return (
    <div className="App">
      <nav style={{ padding: '10px', backgroundColor: '#f0f0f0', marginBottom: '20px', display: 'flex', gap: '15px' }}>
        <button onClick={() => setCurrentPage('login')}>Login</button>
        <button onClick={() => setCurrentPage('dashboard')}>User Dashboard (Placeholder)</button>
        <button onClick={() => setCurrentPage('candidate')}>Candidate Dashboard</button>
        <button onClick={() => setCurrentPage('company')}>Company Dashboard</button>
        <button onClick={() => setCurrentPage('admin')}>Admin Dashboard</button>
      </nav>
      {renderPage()}
    </div>
  );
}

export default App;