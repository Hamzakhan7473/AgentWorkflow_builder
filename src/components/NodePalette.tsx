import React from 'react';
import { NodeType } from '../types';
import { nodeIcons, nodeColors } from '../config/nodeConfigs';
import { Search, Filter } from 'lucide-react';

interface NodePaletteProps {
  onAddNode: (nodeType: NodeType) => void;
}

const nodeTypes = [
  { type: NodeType.WEB_SCRAPING, label: 'Web Scraping', description: 'Extract content from websites', category: 'Data Sources' },
  { type: NodeType.STRUCTURED_OUTPUT, label: 'Structured Output', description: 'Parse data with JSON schema', category: 'Processing' },
  { type: NodeType.EMBEDDING_GENERATOR, label: 'Embedding Generator', description: 'Create vector embeddings', category: 'AI Processing' },
  { type: NodeType.SIMILARITY_SEARCH, label: 'Similarity Search', description: 'Find similar content', category: 'AI Processing' },
  { type: NodeType.LLM_TASK, label: 'LLM Task', description: 'Generate text with AI', category: 'AI Processing' },
  { type: NodeType.DATA_INPUT, label: 'Data Input', description: 'Input data entry point', category: 'Data Sources' },
  { type: NodeType.DATA_OUTPUT, label: 'Data Output', description: 'Output data endpoint', category: 'Data Sources' },
];

const NodePalette: React.FC<NodePaletteProps> = ({ onAddNode }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All');

  const categories = ['All', ...Array.from(new Set(nodeTypes.map(n => n.category)))];
  
  const filteredNodes = nodeTypes.filter(node => {
    const matchesSearch = node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         node.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || node.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-white border-r border-gray-200 w-72 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Node Palette</h2>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
        
        {/* Category Filter */}
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <p className="text-sm text-gray-600">Drag nodes to canvas or click to add</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {filteredNodes.map((nodeType) => (
            <div
              key={nodeType.type}
              className="group p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 hover:shadow-sm transition-all duration-200 bg-white"
              onClick={() => onAddNode(nodeType.type)}
              style={{ borderColor: nodeColors[nodeType.type] }}
            >
              <div className="flex items-start gap-3">
                <div 
                  className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-medium"
                  style={{ backgroundColor: nodeColors[nodeType.type] }}
                >
                  {React.createElement(nodeIcons[nodeType.type], { className: "w-4 h-4" })}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-sm text-gray-900 truncate">
                      {nodeType.label}
                    </h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {nodeType.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {nodeType.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {filteredNodes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No nodes found</p>
              <p className="text-xs mt-1">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500">
          <p className="font-medium mb-2">Quick Tips:</p>
          <ul className="space-y-1">
            <li>• Click to add nodes to canvas</li>
            <li>• Drag from output to input to connect</li>
            <li>• Double-click nodes to configure</li>
            <li>• Use Ctrl+Z/Y for undo/redo</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NodePalette;
