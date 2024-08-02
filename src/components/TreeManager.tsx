import React, { useState, useEffect } from 'react';
import { AppState, TreePage, Node, Dependency } from '../models/models';
import TreePageComponent from './TreePage';
import NodeEditor from './NodeEditor';
import NodeDescription from './NodeDescription';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/storage';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import '../styles.css';

const DEFAULT_IMAGE_URL = 'https://via.placeholder.com/50';

const initializePages = (pages: TreePage[]): TreePage[] => {
  return pages.map(page => ({
    ...page,
    dependencies: page.dependencies || []
  }));
};

const TreeManager: React.FC = () => {
  const [state, setState] = useState<AppState>({
    treePages: initializePages(loadFromLocalStorage('treePages') || []),
    selectedPageId: '',
  });
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [editingNode, setEditingNode] = useState<Node | null>(null);
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [cursorPosition, setCursorPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [breakpoint, setBreakpoint] = useState<number>(5); // Single input for breakpoints
  const [creatingDependency, setCreatingDependency] = useState<{ fromNodeId: string, toNodeId: string | null } | null>(null);
  const [maxPoints, setMaxPoints] = useState<number>(100);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    saveToLocalStorage('treePages', state.treePages);
  }, [state.treePages]);

  const addPage = () => {
    const newPage: TreePage = {
      id: `page-${Date.now()}`,
      name: 'New Page',
      nodes: [],
      dependencies: [] // Initialize dependencies here
    };
    setState((prevState) => ({
      ...prevState,
      treePages: [...prevState.treePages, newPage],
      selectedPageId: newPage.id,
    }));
    setTabIndex(state.treePages.length); // Set focus to the new tab
  };

  const addNode = () => {
    setEditingNode({
      id: `node-${Date.now()}`,
      name: '',
      x: 0,
      y: 0,
      description: '',
      image: DEFAULT_IMAGE_URL,
      maxPoints: 5,
      pointsAssigned: 0,
    });
  };

  const handleNodeSave = (node: Node) => {
    const updatedPages = state.treePages.map((page) => {
      if (page.id === state.selectedPageId) {
        const existingNodeIndex = page.nodes.findIndex((n) => n.id === node.id);
        if (existingNodeIndex > -1) {
          const updatedNodes = [...page.nodes];
          updatedNodes[existingNodeIndex] = node;
          return { ...page, nodes: updatedNodes };
        } else {
          return { ...page, nodes: [...page.nodes, node] };
        }
      }
      return page;
    });

    setState((prevState) => ({
      ...prevState,
      treePages: updatedPages,
    }));
    setEditingNode(null);
  };

  const handleNodeMove = (id: string, x: number, y: number) => {
    const updatedPages = state.treePages.map((page) => {
      if (page.id === state.selectedPageId) {
        const updatedNodes = page.nodes.map((node) =>
          node.id === id ? { ...node, x, y } : node
        );
        return { ...page, nodes: updatedNodes };
      }
      return page;
    });

    setState((prevState) => ({
      ...prevState,
      treePages: updatedPages,
    }));
  };

  const handleAddPoint = (nodeId: string) => {
    const updatedPages = state.treePages.map((page) => {
      if (page.id === state.selectedPageId) {
        const updatedNodes = page.nodes.map((node) => {
          if (node.id === nodeId && (node.pointsAssigned || 0) < (node.maxPoints || 0)) {
            return { ...node, pointsAssigned: (node.pointsAssigned || 0) + 1 };
          }
          return node;
        });
        return { ...page, nodes: updatedNodes };
      }
      return page;
    });

    setState((prevState) => ({
      ...prevState,
      treePages: updatedPages,
    }));
  };

  const handleRemovePoint = (nodeId: string) => {
    const updatedPages = state.treePages.map((page) => {
      if (page.id === state.selectedPageId) {
        const updatedNodes = page.nodes.map((node) => {
          if (node.id === nodeId && (node.pointsAssigned || 0) > 0) {
            const canRemove = page.dependencies.every(dep => {
              if (dep.from === nodeId) {
                const toNode = page.nodes.find(n => n.id === dep.to);
                const pointsRequired = dep.pointsRequired || 0;
                return (toNode?.pointsAssigned || 0) === 0 || (node.pointsAssigned || 0) > pointsRequired;
              }
              return true;
            });
            if (canRemove) {
              return { ...node, pointsAssigned: (node.pointsAssigned || 0) - 1 };
            }
          }
          return node;
        });
        return { ...page, nodes: updatedNodes };
      }
      return page;
    });

    setState((prevState) => ({
      ...prevState,
      treePages: updatedPages,
    }));
  };


  const deleteNode = (nodeId: string) => {
    const updatedPages = state.treePages.map((page) => {
      if (page.id === state.selectedPageId) {
        const updatedNodes = page.nodes.filter((node) => node.id !== nodeId);
        return { ...page, nodes: updatedNodes };
      }
      return page;
    });

    setState((prevState) => ({
      ...prevState,
      treePages: updatedPages,
    }));
    setEditingNode(null);
  };

  const deletePage = (pageId: string) => {
    const updatedPages = state.treePages.filter((page) => page.id !== pageId);

    setState((prevState) => ({
      ...prevState,
      treePages: updatedPages,
      selectedPageId: updatedPages.length > 0 ? updatedPages[0].id : '',
    }));
    setTabIndex(0);
  };

  const loadTreePages = () => {
    const savedPages = initializePages(loadFromLocalStorage('treePages') || []);
    setState({ ...state, treePages: savedPages });
  };

  const handleSelect = (index: number) => {
    setTabIndex(index);
    setState((prevState) => ({
      ...prevState,
      selectedPageId: prevState.treePages[index].id,
    }));
  };

  const handleRenameTab = (index: number, newName: string) => {
    const updatedPages = state.treePages.map((page, i) => (
      i === index ? { ...page, name: newName } : page
    ));
    setState((prevState) => ({
      ...prevState,
      treePages: updatedPages,
    }));
  };

  const handleDoubleClickProgressBar = () => {
    const newBreakpoint = parseInt(prompt('Enter breakpoint value', breakpoint.toString()) || breakpoint.toString(), 10);
    setBreakpoint(newBreakpoint);
  };

  const handleSaveProgressBarSettings = (newMaxPoints: number, newBreakpoint: number) => {
    setMaxPoints(newMaxPoints);
    setBreakpoint(newBreakpoint);
  };

  const handleAddDependency = (fromNodeId: string, toNodeId: string, pointsRequired: number) => {
  const newDependency: Dependency = {
    id: `${fromNodeId}-${toNodeId}-${Date.now()}`,
    from: fromNodeId,
    to: toNodeId,
    pointsRequired,
  };

  const updatedPages = state.treePages.map((page) => {
    if (page.id === state.selectedPageId) {
      return { ...page, dependencies: [...page.dependencies, newDependency] };
    }
    return page;
  });

  setState((prevState) => ({
    ...prevState,
    treePages: updatedPages,
  }));
};

const handleEditDependency = (updatedDependency: Dependency) => {
  const updatedPages = state.treePages.map((page) => {
    if (page.id === state.selectedPageId) {
      const updatedDependencies = page.dependencies.map((dep) =>
        dep.id === updatedDependency.id ? updatedDependency : dep
      );
      return { ...page, dependencies: updatedDependencies };
    }
    return page;
  });

  setState((prevState) => ({
    ...prevState,
    treePages: updatedPages,
  }));
};

const handleDeleteDependency = (dependencyId: string) => {
  const updatedPages = state.treePages.map((page) => {
    if (page.id === state.selectedPageId) {
      const updatedDependencies = page.dependencies.filter(
        (dep) => dep.id !== dependencyId
      );
      return { ...page, dependencies: updatedDependencies };
    }
    return page;
  });

  setState((prevState) => ({
    ...prevState,
    treePages: updatedPages,
  }));
};


  const toggleCreatingDependency = () => {
    setCreatingDependency(creatingDependency ? null : { fromNodeId: '', toNodeId: null });
  };

  return (
    <div className="tree-manager">
      <div className="button-container">
        <button onClick={addPage}>Add New Page</button>
        <button onClick={addNode}>Add New Node</button>
        <button onClick={loadTreePages}>Load Pages</button>
        <button onClick={toggleCreatingDependency}>{creatingDependency ? 'Cancel Dependency' : 'Add Dependency'}</button>
      </div>
      <Tabs selectedIndex={tabIndex} onSelect={handleSelect}>
        <TabList>
          {state.treePages.map((page, index) => (
            <React.Fragment key={page.id}>
              <Tab>
                <input
                  type="text"
                  value={page.name}
                  onChange={(e) => handleRenameTab(index, e.target.value)}
                  style={{ border: 'none', background: 'transparent', color: 'inherit' }}
                />
              </Tab>
              <button className="delete-tab-button" onClick={() => deletePage(page.id)}>x</button>
            </React.Fragment>
          ))}
        </TabList>
        {state.treePages.map((page) => (
          <TabPanel key={page.id} className="tab-panel">
            <TreePageComponent
              page={page}
              breakpoint={breakpoint}
              maxPoints={maxPoints}
              onNodeClick={setEditingNode}
              onNodeMove={handleNodeMove}
              onNodeHover={setHoveredNode}
              onNodeLeave={() => setHoveredNode(null)}
              onAddPoint={handleAddPoint}
              onRemovePoint={handleRemovePoint}
              onDoubleClickProgressBar={handleDoubleClickProgressBar}
              onSaveProgressBarSettings={handleSaveProgressBarSettings}
              onAddDependency={handleAddDependency}
              onEditDependency={handleEditDependency}
              onDeleteDependency={handleDeleteDependency}
              creatingDependency={creatingDependency}
              setCreatingDependency={setCreatingDependency}
            />
          </TabPanel>
        ))}
      </Tabs>
      {editingNode && (
        <NodeEditor
          node={editingNode}
          onSave={handleNodeSave}
          onDelete={deleteNode}
        />
      )}
      {hoveredNode && (
        <NodeDescription node={hoveredNode} cursorPosition={cursorPosition} />
      )}
    </div>
  );
};

export default TreeManager;
