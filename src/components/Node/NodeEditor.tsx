import React, { useState, useEffect } from 'react';
import { Node } from '../../models/models';
import '../../styles/styles.css';

interface NodeEditorProps {
  node: Node | null;
  onSave: (node: Node) => void;
  onDelete: (nodeId: string) => void;
}

const NodeEditor: React.FC<NodeEditorProps> = ({ node, onSave, onDelete }) => {
  const [editingNode, setEditingNode] = useState<Node | null>(node);
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    setEditingNode(node);
    setImage(node?.image || null);
  }, [node]);

  if (!editingNode) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingNode((prevNode) => prevNode ? { ...prevNode, [name]: value } : null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImage(result);
        setEditingNode((prevNode) => prevNode ? { ...prevNode, image: result } : null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (editingNode) {
      onSave(editingNode);
    }
  };

  const handleDelete = () => {
    if (editingNode) {
      onDelete(editingNode.id);
    }
  };

  return (
    <div className="node-editor">
      <h3>Edit Node</h3>
      <input
        type="text"
        name="name"
        value={editingNode.name}
        onChange={handleChange}
        placeholder="Node Name"
      />
      <textarea
        name="description"
        value={editingNode.description}
        onChange={handleChange}
        placeholder="Node Description"
      />
      <input type="file" onChange={handleImageUpload} />
      {image && <img src={image} alt="Node" />}
      <input
        type="number"
        name="maxPoints"
        value={editingNode.maxPoints || 0}
        onChange={handleChange}
        placeholder="Max Points"
      />
      <button onClick={handleSave}>Save</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default NodeEditor;
