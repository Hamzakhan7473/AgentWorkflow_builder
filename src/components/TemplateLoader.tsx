import React, { useState } from 'react';
import { Workflow } from '../types';
import { exampleWorkflows, loadExampleWorkflow } from '../examples/workflowTemplates';
import { FileText, Download, Clock, Users, Zap, Star, ArrowRight } from 'lucide-react';

interface TemplateLoaderProps {
  onLoadTemplate: (workflow: Workflow) => void;
  onClose: () => void;
}

const TemplateLoader: React.FC<TemplateLoaderProps> = ({ onLoadTemplate, onClose }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Marketing': return <Zap className="w-4 h-4" />;
      case 'Customer Service': return <Users className="w-4 h-4" />;
      case 'Analytics': return <FileText className="w-4 h-4" />;
      case 'Social Media': return <Star className="w-4 h-4" />;
      case 'Email Marketing': return <Download className="w-4 h-4" />;
      case 'Sales': return <ArrowRight className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI Agent Templates</h2>
              <p className="text-gray-600 mt-1">Choose from pre-built workflows designed for non-technical users</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exampleWorkflows.map((template) => (
              <div
                key={template.id}
                className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedTemplate === template.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                      {getCategoryIcon(template.category)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-500">{template.category}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
                    {template.difficulty}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {template.description}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{template.estimatedTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    <span>{template.nodes.length} steps</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Perfect for: {template.category.toLowerCase()} teams
                  </div>
                  {selectedTemplate === template.id && (
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {selectedTemplate ? (
                <>
                  Selected: <span className="font-medium text-gray-900">
                    {exampleWorkflows.find(t => t.id === selectedTemplate)?.name}
                  </span>
                </>
              ) : (
                'Select a template to get started'
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLoadTemplate}
                disabled={!selectedTemplate}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Load Template
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateLoader;