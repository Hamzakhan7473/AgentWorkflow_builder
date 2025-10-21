import React from 'react';
import { NodeType } from '../types';
import { nodeIcons, nodeColors } from '../config/nodeConfigs';

interface NodePaletteProps {
  onAddNode: (nodeType: NodeType) => void;
}

const nodeTypes = [
  { type: NodeType.WEB_SCRAPING, label: 'Web Scraping', description: 'Extract content from websites' },
  { type: NodeType.STRUCTURED_OUTPUT, label: 'Structured Output', description: 'Parse data with JSON schema' },
  { type: NodeType.EMBEDDING_GENERATOR, label: 'Embedding Generator', description: 'Create vector embeddings' },
  { type: NodeType.SIMILARITY_SEARCH, label: 'Similarity Search', description: 'Find similar content' },
  { type: NodeType.LLM_TASK, label: 'LLM Task', description: 'Generate text with AI' },
  { type: NodeType.DATA_INPUT, label: 'Data Input', description: 'Input data entry point' },
  { type: NodeType.DATA_OUTPUT, label: 'Data Output', description: 'Output data endpoint' },
];

const NodePalette: React.FC<NodePaletteProps> = ({ onAddNode }) => {
  return (
    <div className="bg-white border-r border-gray-200 w-64 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Node Palette</h2>
        <p className="text-sm text-gray-600 mt-1">Drag nodes to canvas</p>
      </div>
      
      <div className="p-4 space-y-2">
        {nodeTypes.map((nodeType) => (
          <div
            key={nodeType.type}
            className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-colors"
            onClick={() => onAddNode(nodeType.type)}
            style={{ borderColor: nodeColors[nodeType.type] }}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{nodeIcons[nodeType.type]}</span>
              <div className="flex-1">
                <div className="font-medium text-sm text-gray-900">
                  {nodeType.label}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {nodeType.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <p className="font-medium mb-1">Tips:</p>
          <ul className="space-y-1">
            <li>• Click to add nodes</li>
            <li>• Connect nodes with edges</li>
            <li>• Double-click to configure</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NodePalette;
