import React, { useRef, useState, useEffect } from 'react';
import { TreePage, Node, Dependency } from '../models/models';
import NodeComponent from '../components/Node/Node';
import LineComponent from '../components/Dependency/LineComponent';
import ProgressBar from '../components/ProgressBar/ProgressBar';
import ProgressBarDialog from '../components/ProgressBar/ProgressBarDialog';
import DependencyDialog from '../components/Dependency/DependencyDialog';
import '../styles/styles.css';
import 'react-tabs/style/react-tabs.css';

interface TreePageComponentProps {
  page: TreePage;
  breakpoint: number;
  maxPoints: number;
  onNodeClick: (node: Node) => void;
  onNodeMove: (id: string, x: number, y: number) => void;
  onNodeHover: (node: Node) => void;
  onNodeLeave: () => void;
  onAddPoint: (nodeId: string) => void;
  onRemovePoint: (nodeId: string) => void;
  onDoubleClickProgressBar: () => void;
  onSaveProgressBarSettings: (maxPoints: number, breakpoints: number) => void;
  onAddDependency: (fromNodeId: string, toNodeId: string, pointsRequired: number) => void;
  onEditDependency: (dependency: Dependency) => void;
  onDeleteDependency: (dependencyId: string) => void;
  creatingDependency: { fromNodeId: string, toNodeId: string | null } | null;
  setCreatingDependency: React.Dispatch<React.SetStateAction<{ fromNodeId: string, toNodeId: string | null } | null>>;
}

const TreePageComponent: React.FC<TreePageComponentProps> = ({
  page,
  breakpoint,
  maxPoints,
  onNodeClick,
  onNodeMove,
  onNodeHover,
  onNodeLeave,
  onAddPoint,
  onRemovePoint,
  onSaveProgressBarSettings,
  onAddDependency,
  onEditDependency,
  onDeleteDependency,
  creatingDependency,
  setCreatingDependency,
}) => {
  const treePageRef = useRef<HTMLDivElement>(null);
  const [showDependencyDialog, setShowDependencyDialog] = useState<boolean>(false);
  const [showProgressBarDialog, setShowProgressBarDialog] = useState<boolean>(false);
  const [selectedDependency, setSelectedDependency] = useState<Dependency | null>(null);
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
      const x = e.clientX - rect.left - 25;
      const y = e.clientY - rect.top - 25;
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

  const handleLineClick = (dependency: Dependency) => {
    setSelectedDependency(dependency);
    setShowDependencyDialog(true);
  };

  const handleDependencyDialogSave = (fromNodeId: string, toNodeId: string, pointsRequired: number) => {
    if (selectedDependency) {
      onEditDependency({ ...selectedDependency, pointsRequired });
    } else {
      onAddDependency(fromNodeId, toNodeId, pointsRequired);
    }
    setCreatingDependency(null);
    setShowDependencyDialog(false);
    setSelectedDependency(null);
  };

  const handleDependencyDialogDelete = () => {
    if (selectedDependency) {
      onDeleteDependency(selectedDependency.id);
    }
    setShowDependencyDialog(false);
    setSelectedDependency(null);
  };

  const handleDependencyDialogCancel = () => {
    setCreatingDependency(null);
    setShowDependencyDialog(false);
    setSelectedDependency(null);
  };

  const handleProgressBarDoubleClick = () => {
    setShowProgressBarDialog(true);
  };

  const handleProgressBarDialogSave = (maxPoints: number, breakpoints: number) => {
    onSaveProgressBarSettings(maxPoints, breakpoints);
    setShowProgressBarDialog(false);
  };

  const handleProgressBarDialogCancel = () => {
    setShowProgressBarDialog(false);
  };

  const totalPoints = page.nodes.reduce((acc, node) => acc + (node.pointsAssigned || 0), 0);
  const breakpoints = Array.from({ length: Math.ceil(maxPoints / breakpoint + 1) }, (_, i) => i * breakpoint);

  return (
    <div className="tree-page" ref={treePageRef}>
      <div className="tree-page-content">
        {page.nodes.map((node) => (
          <NodeComponent
            key={node.id}
            node={node}
            onClick={() => handleNodeClick(node)}
            onMove={(e) => handleDragEnd(e, node.id)} // Pass the entire event
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
              key={dep.id}
              fromX={fromNode.x + 25}
              fromY={fromNode.y + 25}
              toX={toNode.x + 25}
              toY={toNode.y + 25}
              pointsRequired={dep.pointsRequired}
              onClick={() => handleLineClick(dep)} // Handle line click
            />
          );
        })}
      </div>
      {showDependencyDialog && (
        <DependencyDialog
          fromNodeId={selectedDependency?.from || creatingDependency?.fromNodeId || ''}
          toNodeId={selectedDependency?.to || creatingDependency?.toNodeId || ''}
          pointsRequired={selectedDependency?.pointsRequired || 0}
          onSave={handleDependencyDialogSave}
          onDelete={handleDependencyDialogDelete}
          onCancel={handleDependencyDialogCancel}
        />
      )}
      {showProgressBarDialog && (
        <ProgressBarDialog
          maxPoints={maxPoints}
          breakpoints={breakpoint}
          onSave={handleProgressBarDialogSave}
          onCancel={handleProgressBarDialogCancel}
        />
      )}
      <ProgressBar
        totalPoints={totalPoints}
        breakpoints={breakpoints}
        maxPoints={maxPoints}
        onDoubleClick={handleProgressBarDoubleClick} // Call the double-click handler
      />
    </div>
  );
};

export default TreePageComponent;
