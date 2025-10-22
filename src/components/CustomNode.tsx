import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NodeType, NodeStatus } from '../types';
import { nodeIcons, nodeColors } from '../config/nodeConfigs';
import { Clock, CheckCircle, XCircle, Loader } from 'lucide-react';

interface CustomNodeData {
  label: string;
  status: NodeStatus;
  config: Record<string, any>;
  inputData?: any;
  outputData?: any;
  error?: string;
  executionTime?: number;
}

const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ data, selected }) => {
  const getStatusIcon = (status: NodeStatus) => {
    switch (status) {
      case NodeStatus.IDLE:
        return <Clock className="w-3 h-3" />;
      case NodeStatus.RUNNING:
        return <Loader className="w-3 h-3 animate-spin" />;
      case NodeStatus.SUCCESS:
        return <CheckCircle className="w-3 h-3" />;
      case NodeStatus.ERROR:
        return <XCircle className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  const getStatusColor = (status: NodeStatus) => {
    switch (status) {
      case NodeStatus.IDLE:
        return 'text-gray-400';
      case NodeStatus.RUNNING:
        return 'text-blue-500';
      case NodeStatus.SUCCESS:
        return 'text-green-500';
      case NodeStatus.ERROR:
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  const getNodeTypeFromLabel = (label: string): NodeType => {
    if (label.toLowerCase().includes('web')) return NodeType.WEB_SCRAPING;
    if (label.toLowerCase().includes('structured')) return NodeType.STRUCTURED_OUTPUT;
    if (label.toLowerCase().includes('embedding')) return NodeType.EMBEDDING_GENERATOR;
    if (label.toLowerCase().includes('similarity')) return NodeType.SIMILARITY_SEARCH;
    if (label.toLowerCase().includes('llm')) return NodeType.LLM_TASK;
    if (label.toLowerCase().includes('input')) return NodeType.DATA_INPUT;
    if (label.toLowerCase().includes('output')) return NodeType.DATA_OUTPUT;
    return NodeType.LLM_TASK;
  };

  const nodeType = getNodeTypeFromLabel(data.label);
  const IconComponent = nodeIcons[nodeType];
  const color = nodeColors[nodeType];

  return (
    <div 
      className={`node-container ${selected ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow-sm'} transition-all duration-200`}
      style={{ borderColor: color }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
        style={{ backgroundColor: color }}
      />
      
      <div className="node-header">
        <div className="flex items-center gap-2">
          <div 
            className="w-6 h-6 rounded-md flex items-center justify-center text-white text-sm"
            style={{ backgroundColor: color }}
          >
            <IconComponent className="w-4 h-4" />
          </div>
          <span className="node-title">{data.label}</span>
        </div>
        <div className={`flex items-center gap-1 ${getStatusColor(data.status)}`}>
          {getStatusIcon(data.status)}
        </div>
      </div>
      
      {data.error && (
        <div className="text-xs text-red-600 mb-2 p-2 bg-red-50 rounded border border-red-200">
          <div className="font-medium">Error:</div>
          <div className="mt-1">{data.error}</div>
        </div>
      )}
      
      {data.executionTime && (
        <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {data.executionTime}ms
        </div>
      )}
      
      {data.outputData && (
        <div className="text-xs text-gray-600 p-2 bg-gray-50 rounded border border-gray-200 max-h-20 overflow-y-auto">
          <div className="font-medium text-gray-700 mb-1">Output:</div>
          <div className="font-mono text-xs">
            {JSON.stringify(data.outputData).substring(0, 80)}...
          </div>
        </div>
      )}
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
        style={{ backgroundColor: color }}
      />
    </div>
  );
};

export default CustomNode;
