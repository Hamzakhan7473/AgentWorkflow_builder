import React, { useState } from 'react';
import { ExecutionResult, NodeStatus, NodeType } from '../types';
import { Play, Square, Download, Eye, EyeOff, Minimize2 } from 'lucide-react';
import ResultDisplay from './ResultDisplay';

interface ExecutionPanelProps {
  isExecuting: boolean;
  executionResults: ExecutionResult[];
  executionLogs: string[];
  onStartExecution: () => void;
  onStopExecution: () => void;
  onExportResults: () => void;
  onMinimize: () => void;
  nodes?: any[]; // Add nodes to get node type information
}

const ExecutionPanel: React.FC<ExecutionPanelProps> = ({
  isExecuting,
  executionResults,
  executionLogs,
  onStartExecution,
  onStopExecution,
  onExportResults,
  onMinimize,
  nodes = []
}) => {
  const [showLogs, setShowLogs] = useState(false);
  const [selectedResult, setSelectedResult] = useState<ExecutionResult | null>(null);

  const getNodeInfo = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    return {
      nodeType: node?.data?.nodeType || NodeType.LLM_TASK,
      nodeLabel: node?.data?.label || 'Unknown Node'
    };
  };

  const getStatusIcon = (status: NodeStatus) => {
    switch (status) {
      case NodeStatus.SUCCESS:
        return '✅';
      case NodeStatus.ERROR:
        return '❌';
      case NodeStatus.RUNNING:
        return '⏳';
      default:
        return '⏸️';
    }
  };

  const getStatusColor = (status: NodeStatus) => {
    switch (status) {
      case NodeStatus.SUCCESS:
        return 'text-green-600';
      case NodeStatus.ERROR:
        return 'text-red-600';
      case NodeStatus.RUNNING:
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 h-80 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Execution</h3>
          <div className="flex items-center gap-2">
            {isExecuting ? (
              <button
                className="btn-danger flex items-center gap-2"
                onClick={onStopExecution}
              >
                <Square className="w-4 h-4" />
                Stop
              </button>
            ) : (
              <button
                className="btn-primary flex items-center gap-2"
                onClick={onStartExecution}
              >
                <Play className="w-4 h-4" />
                Run Workflow
              </button>
            )}
            
            {executionResults.length > 0 && (
              <button
                className="btn-secondary flex items-center gap-2"
                onClick={onExportResults}
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            )}
            
            <button
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
              onClick={onMinimize}
              title="Minimize execution panel"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Results Panel */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Execution Results</h4>
            {executionResults.length === 0 ? (
              <p className="text-gray-500 text-sm">No execution results yet</p>
            ) : (
              <div className="space-y-2">
                {executionResults.map((result, index) => (
                  <div
                    key={result.nodeId}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedResult?.nodeId === result.nodeId
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedResult(result)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>{getStatusIcon(result.status)}</span>
                        <span className="font-medium text-sm">Node {index + 1}</span>
                        <span className={`text-xs ${getStatusColor(result.status)}`}>
                          {result.status}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {result.executionTime}ms
                      </span>
                    </div>
                    
                    {result.error && (
                      <div className="text-xs text-red-600 mt-1">
                        Error: {result.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Selected Result Details */}
          {selectedResult && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-4">Result Details</h5>
              <ResultDisplay
                result={selectedResult}
                nodeType={getNodeInfo(selectedResult.nodeId).nodeType}
                nodeLabel={getNodeInfo(selectedResult.nodeId).nodeLabel}
              />
            </div>
          )}
        </div>
        
        {/* Logs Panel */}
        <div className="w-80 border-l border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900">Execution Logs</h4>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setShowLogs(!showLogs)}
            >
              {showLogs ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          
          {showLogs && (
            <div className="bg-gray-50 rounded p-3 h-48 overflow-y-auto">
              {executionLogs.length === 0 ? (
                <p className="text-gray-500 text-sm">No logs yet</p>
              ) : (
                <div className="space-y-1">
                  {executionLogs.map((log, index) => (
                    <div key={index} className="text-xs text-gray-700 font-mono">
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExecutionPanel;
