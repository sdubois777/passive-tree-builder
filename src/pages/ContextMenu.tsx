import React from 'react';
import { Menu, Item, useContextMenu } from 'react-contexify';
import "react-contexify/dist/ReactContexify.css";

const MENU_ID = 'context-menu';

interface ContextMenuProps {
  position: { x: number, y: number };
  onAddNode: () => void;
  onAddDependency: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ position, onAddNode, onAddDependency }) => {
  const { hideAll } = useContextMenu({ id: MENU_ID });

  const handleAddNode = () => {
    onAddNode();
    hideAll();
  };

  const handleAddDependency = () => {
    onAddDependency();
    hideAll();
  };

  return (
    <div style={{ position: 'absolute', top: position.y, left: position.x, zIndex: 10000 }}>
      <Menu id={MENU_ID} theme="dark">
        <Item onClick={handleAddNode}>Add Node</Item>
        <Item onClick={handleAddDependency}>Add Dependency</Item>
      </Menu>
    </div>
  );
};

export const useMyContextMenu = () => {
  const { show } = useContextMenu({ id: MENU_ID });
  return { show };
};

export default ContextMenu;
