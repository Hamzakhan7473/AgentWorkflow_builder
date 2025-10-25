import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { agentDeploymentService, AgentInstance } from '../services/AgentDeploymentService';
import { 
  Play, 
  Loader, 
  CheckCircle, 
  XCircle, 
  Copy, 
  Download,
  Zap
} from 'lucide-react';

interface AgentPageProps {
  agentId: string;
}

const AgentPage: React.FC<AgentPageProps> = ({ agentId }) => {
  const [agent, setAgent] = useState<AgentInstance | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputData, setInputData] = useState('');
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  useEffect(() => {
    const agentInstance = agentDeploymentService.getAgent(agentId);
    if (agentInstance) {
      setAgent(agentInstance);
    } else {
      setError('Agent not found');
    }
  }, [agentId]);

  const handleExecute = async () => {
    if (!agent || !inputData.trim()) return;

    setIsExecuting(true);
    setResult(null);
    setError(null);
    setExecutionTime(null);

    const startTime = Date.now();

    try {
      const response = await agentDeploymentService.executeAgent(agentId, inputData);
      setResult(response);
      setExecutionTime(Date.now() - startTime);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Execution failed');
    } finally {
      setIsExecuting(false);
    }
  };

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    }
  };

  const downloadResult = () => {
    if (result) {
      const dataStr = JSON.stringify(result, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `agent-${agentId}-result.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  if (error && !agent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Agent Not Found</h1>
          <p className="text-gray-600 mb-6">The agent you're looking for doesn't exist or has been deleted.</p>
          <Link
            to="/"
            className="btn-primary"
          >
            Go to Agent Builder
          </Link>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading Agent...</h1>
          <p className="text-gray-600">Please wait while we load your agent.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Zap className="w-7 h-7 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{agent.name}</h1>
                <p className="text-gray-600">{agent.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                agent.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : agent.status === 'paused'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {agent.status}
              </span>
              <Link
                to="/"
                className="btn-secondary"
              >
                Back to Builder
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Execution Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Input Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Execute Agent</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Input Data
                  </label>
                  <textarea
                    value={inputData}
                    onChange={(e) => setInputData(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your input data here..."
                  />
                </div>
                
                <button
                  onClick={handleExecute}
                  disabled={isExecuting || !inputData.trim() || agent.status !== 'active'}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isExecuting ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Executing...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Execute Agent
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Results Section */}
            {(result || error) && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Results</h2>
                  {result && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={copyResult}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                        title="Copy result"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={downloadResult}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                        title="Download result"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {error ? (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="w-5 h-5 text-red-500" />
                      <h3 className="font-medium text-red-900">Execution Error</h3>
                    </div>
                    <p className="text-red-700">{error}</p>
                  </div>
                ) : result ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <h3 className="font-medium text-green-900">Execution Successful</h3>
                      </div>
                      {executionTime && (
                        <p className="text-green-700 text-sm">
                          Completed in {executionTime}ms
                        </p>
                      )}
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Information</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    agent.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : agent.status === 'paused'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {agent.status}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Executions:</span>
                  <span className="font-medium">{agent.usageCount}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">
                    {new Date(agent.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Used:</span>
                  <span className="font-medium">
                    {new Date(agent.lastUsed).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Workflow Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow Details</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Nodes:</span>
                  <span className="font-medium">{agent.workflow.nodes.length}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Connections:</span>
                  <span className="font-medium">{agent.workflow.edges.length}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">AI Tasks:</span>
                  <span className="font-medium">
                    {agent.workflow.nodes.filter(n => n.type === 'llm-task').length}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Data Sources:</span>
                  <span className="font-medium">
                    {agent.workflow.nodes.filter(n => n.type === 'web-scraping').length}
                  </span>
                </div>
              </div>
            </div>

            {/* API Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">API Information</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Agent URL
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded flex-1">
                      {agent.url}
                    </code>
                    <button
                      onClick={() => navigator.clipboard.writeText(agent.url)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    API Endpoint
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded flex-1">
                      {agent.url}/api
                    </code>
                    <button
                      onClick={() => navigator.clipboard.writeText(`${agent.url}/api`)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentPage;
