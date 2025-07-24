import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resultAPI } from '../services/api';
import './ResultPage.css';

const ResultPage = () => {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await resultAPI.getResultById(resultId);
        if (response.data.success) {
          setResult(response.data.result);
        }
      } catch (error) {
        console.error('Failed to load result:', error);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResult();
  }, [resultId, navigate]);

  if (loading) {
    return <div className="loading">Loading results...</div>;
  }

  if (!result) {
    return <div className="error">Result not found</div>;
  }

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

  return (
    <div className="result-page">
      <div className="result-container">
        <div className="result-header">
          <h1>Exam Results</h1>
          <h2>{result.examId.title}</h2>
        </div>

        <div className="score-section">
          <div className="score-circle" style={{ borderColor: getScoreColor(result.percentage) }}>
            <div className="score-text" style={{ color: getScoreColor(result.percentage) }}>
              <div className="percentage">{result.percentage.toFixed(1)}%</div>
              <div className="grade">{getGrade(result.percentage)}</div>
            </div>
          </div>
          
          <div className="score-details">
            <div className="detail-item">
              <span className="label">Score:</span>
              <span className="value">{result.score} / {result.totalQuestions}</span>
            </div>
            <div className="detail-item">
              <span className="label">Time Taken:</span>
              <span className="value">{result.timeTaken} minutes</span>
            </div>
            <div className="detail-item">
              <span className="label">Date:</span>
              <span className="value">{new Date(result.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="actions">
          <button onClick={() => navigate('/dashboard')} className="dashboard-btn">
            Back to Dashboard
          </button>
          <button 
            onClick={() => setShowAnswers(!showAnswers)} 
            className="review-btn"
          >
            {showAnswers ? 'Hide' : 'Review'} Answers
          </button>
        </div>

        {showAnswers && (
          <div className="answers-review">
            <h3>Answer Review</h3>
            {result.detailedAnswers.map((answer, index) => (
              <div key={answer.questionId} className="answer-item">
                <div className="question-header">
                  <span className="question-number">Q{index + 1}</span>
                  <span className={`answer-status ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                    {answer.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                  </span>
                </div>
                
                <p className="question-text">{answer.questionText}</p>
                
                <div className="options-review">
                  {answer.options.map((option) => {
                    const isSelected = option.value === answer.selectedOption;
                    const isCorrect = option.value === answer.correctOption;
                    
                    let optionClass = 'option-review';
                    if (isCorrect) optionClass += ' correct-option';
                    if (isSelected && !isCorrect) optionClass += ' wrong-option';
                    if (isSelected && isCorrect) optionClass += ' selected-correct';
                    
                    return (
                      <div key={option.value} className={optionClass}>
                        <span className="option-label">{option.value})</span>
                        <span className="option-text">{option.text}</span>
                        {isSelected && <span className="selected-indicator">Your Answer</span>}
                        {isCorrect && <span className="correct-indicator">Correct Answer</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultPage;
