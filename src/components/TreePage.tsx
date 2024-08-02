import React, { useRef, useState, useEffect } from 'react';
import { TreePage, Node } from '../models/models';
import NodeComponent from './Node';
import LineComponent from './LineComponent';
import ProgressBar from './ProgressBar';
import DependencyDialog from './DependencyDialog';
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
  onAddDependency: (fromNodeId: string, toNodeId: string, pointsRequired: number) => void;
  creatingDependency: { fromNodeId: string, toNodeId: string | null } | null;
  setCreatingDependency: React.Dispatch<React.SetStateAction<{ fromNodeId: string, toNodeId: string | null } | null>>;
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
  onAddDependency,
  creatingDependency,
  setCreatingDependency,
}) => {
  const treePageRef = useRef<HTMLDivElement>(null);
  const [showDependencyDialog, setShowDependencyDialog] = useState<boolean>(false);
  const [lockedNodes, setLockedNodes] = useState<string[]>([]);

  useEffect(() => {
    const newLockedNodes: string[] = [];

    page.dependencies.forEach((dep) => {
      const fromNode = page.nodes.find((node) => node.id === dep.from);
      const toNode = page.nodes.find((node) => node.id === dep.to);

      if (fromNode && toNode) {
        if ((fromNode.pointsAssigned || 0) < dep.pointsRequired) {
          newLockedNodes.push(toNode.id);
        }
      }
    });

    setLockedNodes(newLockedNodes);
  }, [page.nodes, page.dependencies]);

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    const rect = treePageRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left - 15;
      const y = e.clientY - rect.top - 15;
      onNodeMove(id, x, y);
    }
  };

  const handleNodeClick = (node: Node) => {
    if (creatingDependency) {
      if (creatingDependency.fromNodeId === '') {
        setCreatingDependency({ ...creatingDependency, fromNodeId: node.id });
      } else if (creatingDependency.fromNodeId === node.id) {
        setCreatingDependency({ fromNodeId: '', toNodeId: null });
      } else {
        setCreatingDependency({ ...creatingDependency, toNodeId: node.id });
        setShowDependencyDialog(true);
      }
    } else {
      onNodeClick(node);
    }
  };

  const handleDependencyDialogSave = (fromNodeId: string, toNodeId: string, pointsRequired: number) => {
    onAddDependency(fromNodeId, toNodeId, pointsRequired);
    setCreatingDependency(null);
    setShowDependencyDialog(false);
  };

  const handleDependencyDialogCancel = () => {
    setCreatingDependency(null);
    setShowDependencyDialog(false);
  };

  const totalPoints = page.nodes.reduce((acc, node) => acc + (node.pointsAssigned || 0), 0);
  const breakpoints = Array.from({ length: Math.ceil(100 / breakpoint) }, (_, i) => i * breakpoint);

  return (
    <div className="tree-page" ref={treePageRef}>
      <div className="tree-page-content">
        {page.nodes.map((node) => (
          <NodeComponent
            key={node.id}
            node={node}
            onClick={() => handleNodeClick(node)}
            onMove={(e) => handleDragEnd(e, node.id)}
            onHover={() => onNodeHover(node)}
            onLeave={onNodeLeave}
            onAddPoint={() => onAddPoint(node.id)}
            onRemovePoint={() => onRemovePoint(node.id)}
            locked={lockedNodes.includes(node.id)}
          />
        ))}
        {page.dependencies.map((dep) => {
          const fromNode = page.nodes.find((node) => node.id === dep.from);
          const toNode = page.nodes.find((node) => node.id === dep.to);
          if (!fromNode || !toNode) return null;
          return (
            <LineComponent
              key={`${dep.from}-${dep.to}`}
              fromX={fromNode.x + 15}
              fromY={fromNode.y + 15}
              toX={toNode.x + 15}
              toY={toNode.y + 15}
              pointsRequired={dep.pointsRequired}
            />
          );
        })}
      </div>
      {creatingDependency && creatingDependency.toNodeId && showDependencyDialog && (
        <DependencyDialog
          fromNodeId={creatingDependency.fromNodeId}
          toNodeId={creatingDependency.toNodeId}
          onSave={handleDependencyDialogSave}
          onCancel={handleDependencyDialogCancel}
        />
      )}
      <ProgressBar
        totalPoints={totalPoints}
        breakpoints={breakpoints}
        onDoubleClick={onDoubleClickProgressBar}
      />
    </div>
  );
};

export default TreePageComponent;
