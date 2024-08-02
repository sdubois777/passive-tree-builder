import React, { useRef } from 'react';
import { TreePage, Node } from '../models/models';
import NodeComponent from './Node';
import ProgressBar from './ProgressBar';
import '../styles.css';

interface TreePageComponentProps {
  page: TreePage;
  breakpoint: number;
  onNodeClick: (node: Node) => void;
  onNodeMove: (id: string, x: number, y: number) => void;
  onNodeHover: (node: Node) => void;
  onNodeLeave: () => void;
  onAddPoint: (nodeId: string) => void;
  onRemovePoint: (nodeId: string) => void;
  onDoubleClickProgressBar: () => void;
}

const TreePageComponent: React.FC<TreePageComponentProps> = ({
  page,
  breakpoint,
  onNodeClick,
  onNodeMove,
  onNodeHover,
  onNodeLeave,
  onAddPoint,
  onRemovePoint,
  onDoubleClickProgressBar,
}) => {
  const treePageRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (x: number, y: number, id: string) => {
    onNodeMove(id, x, y);
  };

  const totalPoints = page.nodes.reduce((acc, node) => acc + (node.pointsAssigned || 0), 0);
  const breakpoints = Array.from({ length: Math.ceil(200 / breakpoint + 1) }, (_, i) => i * breakpoint);

  return (
    <div className="tree-page" ref={treePageRef}>
      <div className="tree-page-content">
        {page.nodes.map((node) => (
          <NodeComponent
            key={node.id}
            node={node}
            onClick={() => onNodeClick(node)}
            onMove={(x, y) => handleDragEnd(x, y, node.id)}
            onHover={() => onNodeHover(node)}
            onLeave={onNodeLeave}
            onAddPoint={() => onAddPoint(node.id)}
            onRemovePoint={() => onRemovePoint(node.id)}
          />
        ))}
      </div>
      <ProgressBar
        totalPoints={totalPoints}
        breakpoints={breakpoints}
        onDoubleClick={onDoubleClickProgressBar}
      />
    </div>
  );
};

export default TreePageComponent;
