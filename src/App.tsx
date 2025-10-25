import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import WorkflowBuilder from './components/WorkflowBuilder';
import AgentPage from './components/AgentPage';
import './index.css';

const AgentRoute: React.FC = () => {
  const { agentId } = useParams<{ agentId: string }>();
  return agentId ? <AgentPage agentId={agentId} /> : <div>Invalid agent ID</div>;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<WorkflowBuilder />} />
          <Route path="/agent/:agentId" element={<AgentRoute />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

