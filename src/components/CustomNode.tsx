import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NodeType, NodeStatus } from '../types';
import { nodeIcons, nodeColors } from '../config/nodeConfigs';

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
  const getStatusColor = (status: NodeStatus) => {
    switch (status) {
      case NodeStatus.IDLE:
        return 'bg-gray-300';
      case NodeStatus.RUNNING:
        return 'bg-blue-500 animate-pulse';
      case NodeStatus.SUCCESS:
        return 'bg-green-500';
      case NodeStatus.ERROR:
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getNodeTypeFromLabel = (label: string): NodeType => {
    // This is a simple mapping - in a real app, you'd store the node type in the data
    if (label.toLowerCase().includes('web')) return NodeType.WEB_SCRAPING;
    if (label.toLowerCase().includes('structured')) return NodeType.STRUCTURED_OUTPUT;
    if (label.toLowerCase().includes('embedding')) return NodeType.EMBEDDING_GENERATOR;
    if (label.toLowerCase().includes('similarity')) return NodeType.SIMILARITY_SEARCH;
    if (label.toLowerCase().includes('llm')) return NodeType.LLM_TASK;
    if (label.toLowerCase().includes('input')) return NodeType.DATA_INPUT;
    if (label.toLowerCase().includes('output')) return NodeType.DATA_OUTPUT;
    return NodeType.LLM_TASK; // default
  };

  const nodeType = getNodeTypeFromLabel(data.label);
  const icon = nodeIcons[nodeType];
  const color = nodeColors[nodeType];

  return (
    <div 
      className={`node-container ${selected ? 'ring-2 ring-blue-500' : ''}`}
      style={{ borderColor: color }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-gray-400"
      />
      
      <div className="node-header">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="node-title">{data.label}</span>
        </div>
        <div className={`node-status ${getStatusColor(data.status)}`} />
      </div>
      
      {data.error && (
        <div className="text-xs text-red-600 mb-2 p-2 bg-red-50 rounded">
          {data.error}
        </div>
      )}
      
      {data.executionTime && (
        <div className="text-xs text-gray-500 mb-2">
          Executed in {data.executionTime}ms
        </div>
      )}
      
      {data.outputData && (
        <div className="text-xs text-gray-600 p-2 bg-gray-50 rounded max-h-20 overflow-y-auto">
          <strong>Output:</strong> {JSON.stringify(data.outputData).substring(0, 100)}...
        </div>
      )}
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-gray-400"
      />
    </div>
  );
};

export default CustomNode;
