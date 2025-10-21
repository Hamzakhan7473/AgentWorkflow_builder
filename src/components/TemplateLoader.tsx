import React, { useState } from 'react';
import { Workflow } from '../types';
import { exampleWorkflows, loadExampleWorkflow } from '../examples/workflowTemplates';
import { FileText, Download, Play } from 'lucide-react';

interface TemplateLoaderProps {
  onLoadTemplate: (workflow: Workflow) => void;
  onClose: () => void;
}

const TemplateLoader: React.FC<TemplateLoaderProps> = ({ onLoadTemplate, onClose }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleLoadTemplate = () => {
    if (selectedTemplate) {
      const template = loadExampleWorkflow(selectedTemplate);
      if (template) {
        onLoadTemplate(template);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Load Example Workflow</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            Choose from pre-built workflow templates to get started quickly
          </p>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-96">
          <div className="space-y-4">
            {exampleWorkflows.map((workflow) => (
              <div
                key={workflow.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedTemplate === workflow.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedTemplate(workflow.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <FileText className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{workflow.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{workflow.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>{workflow.nodes.length} nodes</span>
                      <span>{workflow.edges.length} connections</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            className="btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="btn-primary flex items-center gap-2"
            onClick={handleLoadTemplate}
            disabled={!selectedTemplate}
          >
            <Download className="w-4 h-4" />
            Load Template
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateLoader;
