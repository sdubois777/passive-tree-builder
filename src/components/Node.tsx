import React from 'react';
import { Node } from '../models/models';
import '../styles.css';

interface NodeProps {
  node: Node;
  onClick: () => void;
  onMove: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
  onHover: () => void;
  onLeave: () => void;
  onAddPoint: () => void;
  onRemovePoint: () => void;
  locked: boolean;
}

const NodeComponent: React.FC<NodeProps> = ({
  node,
  onClick,
  onMove,
  onHover,
  onLeave,
  onAddPoint,
  onRemovePoint,
  locked,
}) => {
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    onMove(e, node.id);
  };

  const handleLeftClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!locked) {
      onAddPoint();
    }
  };

  const handleRightClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!locked) {
      onRemovePoint();
    }
  };

  return (
    <div
      className={`node ${locked ? 'locked' : ''}`}
      style={{ left: node.x, top: node.y }}
      draggable
      onDragEnd={handleDragEnd}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      onContextMenu={(e) => e.preventDefault()} // Prevent context menu on right-click
    >
      <img src={node.image} alt={node.name} />
      {node.maxPoints > 0 && ( // Only show points badge if maxPoints is greater than 0}
        <div 
          className="points-badge" 
          onClick={handleLeftClick} 
          onContextMenu={handleRightClick} // Separate handlers for left and right clicks
        >
          {node.pointsAssigned}/{node.maxPoints}
        </div>
      )}
    </div>
  );
};

export default NodeComponent;
