// src/components/Login.js
import React, { useState } from 'react';
import './Login.css'; // You already have this CSS file

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    // Prevents the default browser form submission
    event.preventDefault();
    setError(''); // Clear previous errors

    // FastAPI's OAuth2PasswordRequestForm expects data as 'x-www-form-urlencoded'
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    try {
      const response = await fetch('http://127.0.0.1:8000/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
      });

      if (!response.ok) {
        // If login fails (e.g., 401 Unauthorized), throw an error
        throw new Error('Login failed! Please check your credentials.');
      }

      const data = await response.json();

      // On success, store the access token
      localStorage.setItem('accessToken', data.access_token);
      
      // Notify the parent component that login was successful
      if (onLoginSuccess) {
        onLoginSuccess();
      }

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Admin & Company Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit">Log In</button>
        </form>
      </div>
    </div>
  );
}

export default Login;