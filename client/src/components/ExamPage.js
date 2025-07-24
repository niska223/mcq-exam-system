import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examAPI, resultAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Timer from './Timer';
import './ExamPage.css';

const ExamPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeStarted, setTimeStarted] = useState(null);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await examAPI.getExamById(examId);
        if (response.data.success) {
          setExam(response.data.exam);
          setQuestions(response.data.questions);
          setTimeStarted(Date.now());
        }
      } catch (error) {
        console.error('Failed to load exam:', error);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    
    fetchExam();
  }, [examId, navigate]);

  const handleAnswerSelect = (questionId, selectedOption) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (window.confirm('Are you sure you want to submit the exam?')) {
      setSubmitting(true);
      try {
        const timeTaken = Math.round((Date.now() - timeStarted) / 60000); // in minutes
        const formattedAnswers = Object.entries(answers).map(([questionId, selectedOption]) => ({
          questionId,
          selectedOption
        }));

        console.log('Submitting exam with data:', {
          userId: user.id,
          examId,
          answers: formattedAnswers,
          timeTaken
        });

        const response = await resultAPI.submitResult({
          userId: user.id,
          examId,
          answers: formattedAnswers,
          timeTaken
        });

        console.log('Submit response:', response);

        if (response.data.success) {
          navigate(`/result/${response.data.result.id}`);
        } else {
          alert('Submission failed: ' + (response.data.message || 'Unknown error'));
        }
      } catch (error) {
        console.error('Failed to submit exam:', error);
        console.error('Error details:', error.response?.data || error.message);
        
        let errorMessage = 'Failed to submit exam. Please try again.';
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message.includes('Network Error')) {
          errorMessage = 'Cannot connect to server. Please make sure the server is running on http://localhost:5000';
        }
        
        alert(errorMessage);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleTimeUp = () => {
    handleSubmit();
  };

  if (loading) {
    return <div className="loading">Loading exam...</div>;
  }

  if (!exam || questions.length === 0) {
    return <div className="error">Exam not found</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="exam-page">
      <div className="exam-header">
        <div className="exam-info">
          <h1>{exam.title}</h1>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <p>Question {currentQuestionIndex + 1} of {questions.length}</p>
        </div>
        <Timer duration={exam.duration} onTimeUp={handleTimeUp} />
      </div>

      <div className="exam-content">
        <div className="question-section">
          <h2>{currentQuestion.questionText}</h2>
          <div className="options">
            {currentQuestion.options.map((option) => (
              <label key={option.value} className="option">
                <input
                  type="radio"
                  name={`question-${currentQuestion._id}`}
                  value={option.value}
                  checked={answers[currentQuestion._id] === option.value}
                  onChange={() => handleAnswerSelect(currentQuestion._id, option.value)}
                />
                <span className="option-text">{option.text}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="navigation">
          <button 
            onClick={handlePrevious} 
            disabled={currentQuestionIndex === 0}
            className="nav-btn prev-btn"
          >
            Previous
          </button>
          
          {currentQuestionIndex === questions.length - 1 ? (
            <button 
              onClick={handleSubmit} 
              disabled={submitting}
              className="nav-btn submit-btn"
            >
              {submitting ? 'Submitting...' : 'Submit Exam'}
            </button>
          ) : (
            <button 
              onClick={handleNext}
              className="nav-btn next-btn"
            >
              Next
            </button>
          )}
        </div>

        <div className="question-navigator">
          <h3>Questions</h3>
          <div className="question-grid">
            {questions.map((_, index) => (
              <button
                key={index}
                className={`question-number ${
                  index === currentQuestionIndex ? 'current' : ''
                } ${
                  answers[questions[index]._id] ? 'answered' : ''
                }`}
                onClick={() => setCurrentQuestionIndex(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPage;
