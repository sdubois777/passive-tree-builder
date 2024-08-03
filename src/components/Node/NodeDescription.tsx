import React from 'react';
import { Node } from '../../models/models';
import '../../styles/styles.css';

interface NodeDescriptionProps {
  node: Node | null;
  cursorPosition: { x: number; y: number };
}

const NodeDescription: React.FC<NodeDescriptionProps> = ({ node, cursorPosition }) => {
  if (!node) return null;

  const style: React.CSSProperties = {
    position: 'absolute',
    left: cursorPosition.x + 10,
    top: cursorPosition.y + 10,
  };

  return (
    <div className="node-description" style={style}>
      <h4 className="node-description-title">{node.name}</h4>
      <p className="node-description-text">{node.description}</p>
    </div>
  );
};

export default NodeDescription;
