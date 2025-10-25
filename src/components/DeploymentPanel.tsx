import React, { useState } from 'react';
import { Workflow } from '../types';
import { DeploymentConfig, DeploymentResult, agentDeploymentService } from '../services/AgentDeploymentService';
import { 
  Rocket, 
  Settings, 
  Globe, 
  Copy, 
  ExternalLink, 
  Play, 
  Pause, 
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  Users,
  Zap
} from 'lucide-react';

interface DeploymentPanelProps {
  workflow: Workflow;
  onClose: () => void;
}

const DeploymentPanel: React.FC<DeploymentPanelProps> = ({ workflow, onClose }) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState<DeploymentResult | null>(null);
  const [config, setConfig] = useState<DeploymentConfig>({
    agentName: workflow.name || 'My Agent',
    description: workflow.description || 'AI agent created with Agent Workflow Builder',
    isPublic: false,
    rateLimit: 100,
    allowedDomains: []
  });

  const handleDeploy = async () => {
    setIsDeploying(true);
    setDeploymentResult(null);
    
    try {
      const result = await agentDeploymentService.deployAgent(workflow, config);
      setDeploymentResult(result);
    } catch (error) {
      console.error('Deployment failed:', error);
      setDeploymentResult({
        agentId: '',
        agentUrl: '',
        status: 'failed',
        deploymentTime: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'deployed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'deploying':
        return <Clock className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed':
        return 'text-green-600';
      case 'deploying':
        return 'text-blue-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Rocket className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Deploy Agent Instantly</h2>
                <p className="text-gray-600">Make your workflow live and accessible</p>
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
          {!deploymentResult ? (
            <div className="space-y-6">
              {/* Configuration Section */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Agent Configuration
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Agent Name
                    </label>
                    <input
                      type="text"
                      value={config.agentName}
                      onChange={(e) => setConfig({ ...config, agentName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="My AI Agent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rate Limit (requests/hour)
                    </label>
                    <input
                      type="number"
                      value={config.rateLimit}
                      onChange={(e) => setConfig({ ...config, rateLimit: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="100"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={config.description}
                    onChange={(e) => setConfig({ ...config, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Describe what your agent does..."
                  />
                </div>
                
                <div className="mt-4 flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={config.isPublic}
                      onChange={(e) => setConfig({ ...config, isPublic: e.target.checked })}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">Make agent publicly accessible</span>
                  </label>
                </div>
              </div>
              
              {/* Workflow Preview */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow Preview</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{workflow.nodes.length}</div>
                    <div className="text-sm text-blue-700">Nodes</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{workflow.edges.length}</div>
                    <div className="text-sm text-green-700">Connections</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {workflow.nodes.filter(n => n.type === 'llm-task').length}
                    </div>
                    <div className="text-sm text-purple-700">AI Tasks</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {workflow.nodes.filter(n => n.type === 'web-scraping').length}
                    </div>
                    <div className="text-sm text-orange-700">Data Sources</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Deployment Result */}
              <div className={`p-6 rounded-xl border-2 ${
                deploymentResult.status === 'deployed' 
                  ? 'bg-green-50 border-green-200' 
                  : deploymentResult.status === 'failed'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  {getStatusIcon(deploymentResult.status)}
                  <div>
                    <h3 className={`text-lg font-semibold ${getStatusColor(deploymentResult.status)}`}>
                      {deploymentResult.status === 'deployed' ? 'Agent Deployed Successfully!' : 
                       deploymentResult.status === 'failed' ? 'Deployment Failed' : 'Deploying...'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {deploymentResult.status === 'deployed' ? 
                        `Deployed in ${deploymentResult.deploymentTime}ms` :
                        deploymentResult.status === 'failed' ? 
                        deploymentResult.error : 
                        'Please wait while we deploy your agent...'}
                    </p>
                  </div>
                </div>
                
                {deploymentResult.status === 'deployed' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-white rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          Agent URL
                        </h4>
                        <div className="flex items-center gap-2">
                          <code className="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded flex-1">
                            {deploymentResult.agentUrl}
                          </code>
                          <button
                            onClick={() => copyToClipboard(deploymentResult.agentUrl)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-white rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          API Endpoint
                        </h4>
                        <div className="flex items-center gap-2">
                          <code className="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded flex-1">
                            {deploymentResult.apiEndpoint}
                          </code>
                          <button
                            onClick={() => copyToClipboard(deploymentResult.apiEndpoint || '')}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <a
                        href={deploymentResult.agentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Test Agent
                      </a>
                      <button
                        onClick={() => copyToClipboard(deploymentResult.agentUrl)}
                        className="btn-secondary flex items-center gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Copy URL
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Agent Stats */}
              {deploymentResult.status === 'deployed' && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Agent Statistics
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">0</div>
                      <div className="text-sm text-gray-600">Executions</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="text-2xl font-bold text-green-600">Active</div>
                      <div className="text-sm text-gray-600">Status</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">100</div>
                      <div className="text-sm text-gray-600">Rate Limit/hr</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">0ms</div>
                      <div className="text-sm text-gray-600">Avg Response</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {deploymentResult ? (
                deploymentResult.status === 'deployed' ? 
                  'Agent is live and ready to use!' : 
                  deploymentResult.status === 'failed' ? 
                  'Deployment failed. Please try again.' : 
                  'Deploying your agent...'
              ) : (
                'Configure your agent settings and deploy'
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                {deploymentResult ? 'Close' : 'Cancel'}
              </button>
              {!deploymentResult && (
                <button
                  onClick={handleDeploy}
                  disabled={isDeploying || !config.agentName}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isDeploying ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" />
                      Deploying...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-4 h-4" />
                      Deploy Agent
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentPanel;
