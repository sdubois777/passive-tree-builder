import React from 'react';
import { TreePage, Node } from '../models/models';
import NodeComponent from './Node';
import '../styles.css';

interface TreePageComponentProps {
  page: TreePage;
  onNodeClick: (node: Node) => void;
  onNodeMove: (id: string, x: number, y: number) => void;
  onNodeHover: (node: Node) => void;
  onNodeLeave: () => void;
  onAddPoint: (nodeId: string) => void;
  onRemovePoint: (nodeId: string) => void;
}

const TreePageComponent: React.FC<TreePageComponentProps> = ({
  page,
  onNodeClick,
  onNodeMove,
  onNodeHover,
  onNodeLeave,
  onAddPoint,
  onRemovePoint,
}) => {
  console.log('Rendering TreePageComponent with nodes:', page.nodes);

  return (
    <div className="tree-page">
      {page.nodes.map((node) => (
        <NodeComponent
          key={node.id}
          node={node}
          onClick={() => onNodeClick(node)}
          onMove={(x, y) => onNodeMove(node.id, x, y)}
          onHover={() => onNodeHover(node)}
          onLeave={onNodeLeave}
          onAddPoint={() => onAddPoint(node.id)}
          onRemovePoint={() => onRemovePoint(node.id)}
        />
      ))}
    </div>
  );
};

export default TreePageComponent;
