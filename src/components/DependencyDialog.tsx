import React, { useState } from 'react';
import '../styles.css';

interface DependencyDialogProps {
  fromNodeId: string;
  toNodeId: string;
  onSave: (fromNodeId: string, toNodeId: string, pointsRequired: number) => void;
  onCancel: () => void;
}

const DependencyDialog: React.FC<DependencyDialogProps> = ({ fromNodeId, toNodeId, onSave, onCancel }) => {
  const [pointsRequired, setPointsRequired] = useState<number>(1);

  const handleSave = () => {
    onSave(fromNodeId, toNodeId, pointsRequired);
  };

  return (
    <div className="dependency-dialog">
      <h3>Set Dependency</h3>
      <div>
        <label>Points Required: </label>
        <input
          type="number"
          value={pointsRequired}
          onChange={(e) => setPointsRequired(parseInt(e.target.value))}
          min="1"
        />
      </div>
      <button onClick={handleSave}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default DependencyDialog;
