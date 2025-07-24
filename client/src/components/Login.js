import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData.email, formData.password);
      if (response.data.success) {
        login(response.data.user);
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (userType) => {
    if (userType === 'student1') {
      setFormData({ email: 'student1@example.com', password: 'password123' });
    } else if (userType === 'student2') {
      setFormData({ email: 'student2@example.com', password: 'password123' });
    } else if (userType === 'admin') {
      setFormData({ email: 'admin@example.com', password: 'admin123' });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>MCQ Exam System</h2>
        <h3>Login</h3>
        
        <div className="demo-credentials">
          <p>Demo Credentials (click to fill):</p>
          <div className="demo-buttons">
            <button type="button" onClick={() => fillDemoCredentials('student1')}>
              Student 1
            </button>
            <button type="button" onClick={() => fillDemoCredentials('student2')}>
              Student 2
            </button>
            <button type="button" onClick={() => fillDemoCredentials('admin')}>
              Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
