import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { resultAPI } from '../services/api';
import './ResultHistory.css';

const ResultHistory = ({ userId }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await resultAPI.getUserResults(userId);
        if (response.data.success) {
          setResults(response.data.results);
        }
      } catch (error) {
        setError('Failed to load exam history');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [userId]);

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return '#28a745';
    if (percentage >= 60) return '#ffc107';
    return '#dc3545';
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  };

  if (loading) {
    return <div className="loading">Loading exam history...</div>;
  }

  return (
    <div className="result-history">
      <h2>Your Exam History</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      {results.length === 0 ? (
        <div className="no-results">
          <p>No exams completed yet.</p>
          <p>Take an exam to see your results here!</p>
        </div>
      ) : (
        <div className="results-grid">
          {results.map((result) => (
            <div key={result._id} className="result-card">
              <div className="result-card-header">
                <h3>{result.examId.title}</h3>
                <div 
                  className="score-badge"
                  style={{ backgroundColor: getScoreColor(result.percentage) }}
                >
                  {getGrade(result.percentage)}
                </div>
              </div>
              
              <div className="result-card-body">
                <div className="score-info">
                  <div className="score-display">
                    <span className="score-number">{result.percentage.toFixed(1)}%</span>
                    <span className="score-fraction">({result.score}/{result.totalQuestions})</span>
                  </div>
                </div>
                
                <div className="result-details">
                  <div className="detail">
                    <span className="label">Time Taken:</span>
                    <span className="value">{result.timeTaken} min</span>
                  </div>
                  <div className="detail">
                    <span className="label">Date:</span>
                    <span className="value">
                      {new Date(result.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="result-card-footer">
                <button 
                  onClick={() => navigate(`/result/${result._id}`)}
                  className="view-result-btn"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultHistory;
