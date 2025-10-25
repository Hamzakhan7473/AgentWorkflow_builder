import React, { useState, useEffect } from 'react';
import { AgentInstance, agentDeploymentService } from '../services/AgentDeploymentService';
import { 
  Play, 
  Pause, 
  Trash2, 
  ExternalLink, 
  Copy, 
  BarChart3, 
  Clock, 
  Users, 
  Zap,
  Globe,
  Settings,
  Eye,
  EyeOff,
  XCircle
} from 'lucide-react';

interface AgentDashboardProps {
  onClose: () => void;
}

const AgentDashboard: React.FC<AgentDashboardProps> = ({ onClose }) => {
  const [agents, setAgents] = useState<AgentInstance[]>([]);
  const [stats, setStats] = useState(agentDeploymentService.getDeploymentStats());
  const [selectedAgent, setSelectedAgent] = useState<AgentInstance | null>(null);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = () => {
    const allAgents = agentDeploymentService.getAllAgents();
    setAgents(allAgents);
    setStats(agentDeploymentService.getDeploymentStats());
  };

  const handlePauseAgent = (agentId: string) => {
    agentDeploymentService.pauseAgent(agentId);
    loadAgents();
  };

  const handleResumeAgent = (agentId: string) => {
    agentDeploymentService.resumeAgent(agentId);
    loadAgents();
  };

  const handleDeleteAgent = (agentId: string) => {
    if (window.confirm('Are you sure you want to delete this agent?')) {
      agentDeploymentService.deleteAgent(agentId);
      loadAgents();
      if (selectedAgent?.id === agentId) {
        setSelectedAgent(null);
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'paused':
        return 'text-yellow-600 bg-yellow-100';
      case 'stopped':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Agent Dashboard</h2>
                <p className="text-gray-600">Manage your deployed agents</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Statistics Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-900">{stats.totalAgents}</div>
                  <div className="text-sm text-blue-700">Total Agents</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Play className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-900">{stats.activeAgents}</div>
                  <div className="text-sm text-green-700">Active Agents</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-900">{stats.totalExecutions}</div>
                  <div className="text-sm text-purple-700">Total Executions</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-900">{stats.averageExecutionTime}s</div>
                  <div className="text-sm text-orange-700">Avg Response Time</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Agents List */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Deployed Agents</h3>
              {agents.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No agents deployed yet</h4>
                  <p className="text-gray-600">Create and deploy your first agent to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {agents.map((agent) => (
                    <div
                      key={agent.id}
                      className={`p-4 border rounded-xl cursor-pointer transition-all ${
                        selectedAgent?.id === agent.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedAgent(agent)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{agent.name}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                              {agent.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{agent.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Created: {formatDate(agent.createdAt)}</span>
                            <span>Executions: {agent.usageCount}</span>
                            <span>Last used: {formatDate(agent.lastUsed)}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(agent.url);
                            }}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                            title="Copy URL"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          
                          <a
                            href={agent.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                            title="Test Agent"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          
                          {agent.status === 'active' ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePauseAgent(agent.id);
                              }}
                              className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-100 rounded"
                              title="Pause Agent"
                            >
                              <Pause className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleResumeAgent(agent.id);
                              }}
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-100 rounded"
                              title="Resume Agent"
                            >
                              <Play className="w-4 h-4" />
                            </button>
                          )}
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAgent(agent.id);
                            }}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded"
                            title="Delete Agent"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Agent Details */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Details</h3>
              {selectedAgent ? (
                <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">{selectedAgent.name}</h4>
                    <p className="text-sm text-gray-600">{selectedAgent.description}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedAgent.status)}`}>
                        {selectedAgent.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Executions:</span>
                      <span className="font-medium">{selectedAgent.usageCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium">{formatDate(selectedAgent.createdAt)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Last Used:</span>
                      <span className="font-medium">{formatDate(selectedAgent.lastUsed)}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h5 className="font-medium text-gray-900 mb-2">Agent URL</h5>
                    <div className="flex items-center gap-2">
                      <code className="text-xs text-gray-700 bg-white px-2 py-1 rounded flex-1">
                        {selectedAgent.url}
                      </code>
                      <button
                        onClick={() => copyToClipboard(selectedAgent.url)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <a
                      href={selectedAgent.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Test Agent
                    </a>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <Settings className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">Select an agent to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {agents.length} agent{agents.length !== 1 ? 's' : ''} deployed
            </div>
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Close Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
