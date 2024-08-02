export interface Node {
  id: string;
  name: string;
  x: number;
  y: number;
  description: string;
  image: string;
  maxPoints: number;
  pointsAssigned: number;
}

export interface Dependency {
  from: string;
  to: string;
  pointsRequired: number;
}

export interface TreePage {
  id: string;
  name: string;
  nodes: Node[];
  dependencies: Dependency[];
}

export interface AppState {
  treePages: TreePage[];
  selectedPageId: string;
}
