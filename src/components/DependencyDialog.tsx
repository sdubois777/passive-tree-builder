import React, { useState } from 'react';
import '../styles.css';
interface DependencyDialogProps {
  fromNodeId: string;
  toNodeId: string;
  pointsRequired: number;
  onSave: (fromNodeId: string, toNodeId: string, pointsRequired: number) => void;
  onDelete: () => void;
  onCancel: () => void;
}

const DependencyDialog: React.FC<DependencyDialogProps> = ({
  fromNodeId,
  toNodeId,
  pointsRequired: initialPointsRequired,
  onSave,
  onDelete,
  onCancel,
}) => {
  const [pointsRequired, setPointsRequired] = useState(initialPointsRequired);

  const handleSave = () => {
    onSave(fromNodeId, toNodeId, pointsRequired);
  };

  const handleDelete = () => {
    onDelete();
  };

  return (
    <div className="dependency-dialog">
      <h3>Edit Dependency</h3>
      <label>
        Points Required:
        <input
          type="number"
          value={pointsRequired}
          onChange={(e) => setPointsRequired(parseInt(e.target.value, 10))}
        />
      </label>
      <div>
        <button onClick={handleSave}>Save</button>
        <button onClick={handleDelete}>Delete</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default DependencyDialog;
