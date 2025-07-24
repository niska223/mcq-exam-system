import React, { useState, useEffect } from 'react';
import { examAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ExamCard from './ExamCard';
import ResultHistory from './ResultHistory';
import './Dashboard.css';

const Dashboard = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('exams');
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await examAPI.getAllExams();
      if (response.data.success) {
        setExams(response.data.exams);
      }
    } catch (error) {
      setError('Failed to load exams');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return <div className="loading">Loading exams...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>MCQ Exam System</h1>
          <div className="user-info">
            <span>Welcome, {user.name}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button 
          className={activeTab === 'exams' ? 'active' : ''}
          onClick={() => setActiveTab('exams')}
        >
          Available Exams
        </button>
        <button 
          className={activeTab === 'history' ? 'active' : ''}
          onClick={() => setActiveTab('history')}
        >
          Exam History
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'exams' && (
          <div className="exams-section">
            <h2>Available Mock Exams</h2>
            {error && <div className="error-message">{error}</div>}
            <div className="exams-grid">
              {exams.map(exam => (
                <ExamCard key={exam._id} exam={exam} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <ResultHistory userId={user.id} />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
