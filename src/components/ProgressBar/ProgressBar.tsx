import React from 'react';

interface ProgressBarProps {
  totalPoints: number;
  breakpoints: number[];
  maxPoints: number;
  onDoubleClick: () => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  totalPoints,
  breakpoints,
  maxPoints,
  onDoubleClick,
}) => {
  const percentage = (totalPoints / maxPoints) * 100;
  
  return (
    <div className="progress-bar-container" onDoubleClick={onDoubleClick}>
      <div className="progress-bar" style={{ width: `${percentage}%` }} />
      {breakpoints.map((breakpoint, index) => (
        <div
          key={index}
          className="breakpoint"
          style={{ left: `${(breakpoint / maxPoints) * 100}%` }}
        >
          {breakpoint}
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
