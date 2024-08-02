import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TreeManager from './components/TreeManager';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TreeManager />} />
      </Routes>
    </Router>
  );
};

export default App;
