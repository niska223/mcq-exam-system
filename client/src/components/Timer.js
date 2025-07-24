import React, { useState, useEffect } from 'react';
import './Timer.css';

const Timer = ({ duration, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert minutes to seconds

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerClass = () => {
    if (timeLeft <= 300) return 'timer critical'; // Last 5 minutes
    if (timeLeft <= 600) return 'timer warning'; // Last 10 minutes
    return 'timer';
  };

  return (
    <div className={getTimerClass()}>
      <div className="timer-icon">⏰</div>
      <div className="timer-text">
        <div className="time-display">{formatTime(timeLeft)}</div>
        <div className="time-label">Time Remaining</div>
      </div>
    </div>
  );
};

export default Timer;
