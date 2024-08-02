import React from 'react';
import { Node } from '../models/models';
import '../styles.css';

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
    backgroundColor: 'white',
    border: '1px solid gray',
    padding: '5px',
    zIndex: 1000,
  };

  return (
      <div
        className="node-description"
        style={style}
      >
        <h4>{node.name}</h4>
        <p>{node.description}</p>
      </div>
    );
};

export default NodeDescription;
