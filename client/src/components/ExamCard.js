import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ExamCard.css';

const ExamCard = ({ exam }) => {
  const navigate = useNavigate();

  const handleStartExam = () => {
    navigate(`/exam/${exam._id}`);
  };

  return (
    <div className="exam-card">
      <div className="exam-header">
        <h3>{exam.title}</h3>
      </div>
      <div className="exam-body">
        <p className="exam-description">{exam.description}</p>
        <div className="exam-details">
          <div className="detail-item">
            <span className="label">Questions:</span>
            <span className="value">{exam.totalQuestions}</span>
          </div>
          <div className="detail-item">
            <span className="label">Duration:</span>
            <span className="value">{exam.duration} minutes</span>
          </div>
        </div>
      </div>
      <div className="exam-footer">
        <button onClick={handleStartExam} className="start-exam-btn">
          Start Exam
        </button>
      </div>
    </div>
  );
};

export default ExamCard;
