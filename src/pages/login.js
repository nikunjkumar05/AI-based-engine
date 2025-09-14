import React from 'react';

function Login({ onLoginSuccess }) {
  const handleLogin = () => {
    // Simulate a login process
    alert('Logged in!');
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Login Page</h2>
      <p>This is a placeholder for your login form.</p>
      <button onClick={handleLogin} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Simulate Login
      </button>
    </div>
  );
}

export default Login;