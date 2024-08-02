import React from 'react';
import '../styles.css';

interface ProgressBarProps {
  totalPoints: number;
  breakpoints: number[];
  onDoubleClick: () => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ totalPoints, breakpoints, onDoubleClick }) => {
  const progressPercentage = (totalPoints / (breakpoints[breakpoints.length - 1] || 1)) * 100;

  return (
    <div className="progress-bar-container" onDoubleClick={onDoubleClick}>
      <div className="progress-bar" style={{ width: `${progressPercentage}%` }} />
      {breakpoints.map((point, index) => (
        <div key={index} className="breakpoint" style={{ left: `${(point / (breakpoints[breakpoints.length - 1] || 1)) * 100}%` }}>
          {point}
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
