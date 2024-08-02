import React from 'react';
import { Node } from '../models/models';
import '../styles.css';

interface NodeProps {
  node: Node;
  onClick: () => void;
  onMove: (x: number, y: number) => void;
  onHover: () => void;
  onLeave: () => void;
  onAddPoint: () => void;
  onRemovePoint: () => void;
  isLocked?: boolean;
}

const NodeComponent: React.FC<NodeProps> = ({
  node,
  onClick,
  onMove,
  onHover,
  onLeave,
  onAddPoint,
  onRemovePoint,
}) => {
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const nodeRect = e.currentTarget.getBoundingClientRect();
    const containerRect = e.currentTarget.parentElement?.getBoundingClientRect();

    if (containerRect) {
      const snappedX = e.clientX - containerRect.left - nodeRect.width / 2;
      const snappedY = e.clientY - containerRect.top - nodeRect.height / 2;
      onMove(snappedX, snappedY);
    }
  };

  return (
    <div
      className="node"
      style={{
        left: node.x,
        top: node.y,
      }}
      onDoubleClick={onClick}
      draggable
      onDragEnd={handleDragEnd}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onContextMenu={(e) => {
        e.preventDefault();
        onRemovePoint();
      }}
      onClick={onAddPoint}
    >
      {node.image ? (
        <img src={node.image} alt="Node" />
      ) : (
        node.name
      )}
      <div className="points-badge">
        {node.pointsAssigned || 0}/{node.maxPoints || 0}
      </div>
    </div>
  );
};

export default NodeComponent;
