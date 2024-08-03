import React, { useState } from 'react';
import '../../styles/styles.css';

interface ProgressBarDialogProps {
  maxPoints: number;
  breakpoints: number;
  onSave: (maxPoints: number, breakpoints: number) => void;
  onCancel: () => void;
}

const ProgressBarDialog: React.FC<ProgressBarDialogProps> = ({
  maxPoints: initialMaxPoints,
  breakpoints: initialBreakpoints,
  onSave,
  onCancel,
}) => {
  const [maxPoints, setMaxPoints] = useState(initialMaxPoints);
  const [breakpoints, setBreakpoints] = useState(initialBreakpoints);

  const handleSave = () => {
    onSave(maxPoints, breakpoints);
  };

  return (
    <div className="progress-bar-dialog">
      <h3>Edit Progress Bar</h3>
      <label>
        Max Points:
        <input
          type="number"
          value={maxPoints}
          onChange={(e) => setMaxPoints(parseInt(e.target.value, 10))}
        />
      </label>
      <label>
        Breakpoints:
        <input
          type="number"
          value={breakpoints}
          onChange={(e) => setBreakpoints(parseInt(e.target.value, 10))}
        />
      </label>
      <div>
        <button onClick={handleSave}>Save</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default ProgressBarDialog;
