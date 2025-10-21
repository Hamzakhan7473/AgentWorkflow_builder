import React, { useState, useEffect } from 'react';
import { NodeType, NodeStatus } from '../types';
import { nodeConfigs } from '../config/nodeConfigs';

interface NodeConfigPanelProps {
  nodeId: string;
  nodeType: NodeType;
  nodeLabel: string;
  config: Record<string, any>;
  onConfigChange: (nodeId: string, config: Record<string, any>) => void;
  onClose: () => void;
}

const NodeConfigPanel: React.FC<NodeConfigPanelProps> = ({
  nodeId,
  nodeType,
  nodeLabel,
  config,
  onConfigChange,
  onClose
}) => {
  const [localConfig, setLocalConfig] = useState<Record<string, any>>(config);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalConfig(config);
    setHasChanges(false);
  }, [config, nodeId]);

  const handleConfigChange = (key: string, value: any) => {
    const newConfig = { ...localConfig, [key]: value };
    setLocalConfig(newConfig);
    setHasChanges(true);
  };

  const handleSave = () => {
    onConfigChange(nodeId, localConfig);
    setHasChanges(false);
  };

  const handleCancel = () => {
    setLocalConfig(config);
    setHasChanges(false);
    onClose();
  };

  const renderConfigField = (key: string, fieldConfig: any) => {
    const value = localConfig[key] ?? fieldConfig.defaultValue ?? '';

    switch (fieldConfig.type) {
      case 'string':
        return (
          <input
            type="text"
            className="config-input"
            value={value}
            onChange={(e) => handleConfigChange(key, e.target.value)}
            placeholder={fieldConfig.placeholder}
          />
        );
      
      case 'number':
        return (
          <input
            type="number"
            className="config-input"
            value={value}
            onChange={(e) => handleConfigChange(key, parseFloat(e.target.value) || 0)}
            placeholder={fieldConfig.placeholder}
          />
        );
      
      case 'boolean':
        return (
          <input
            type="checkbox"
            className="mr-2"
            checked={value}
            onChange={(e) => handleConfigChange(key, e.target.checked)}
          />
        );
      
      case 'select':
        return (
          <select
            className="config-select"
            value={value}
            onChange={(e) => handleConfigChange(key, e.target.value)}
          >
            {fieldConfig.options?.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      
      case 'textarea':
        return (
          <textarea
            className="config-textarea"
            rows={4}
            value={value}
            onChange={(e) => handleConfigChange(key, e.target.value)}
            placeholder={fieldConfig.placeholder}
          />
        );
      
      default:
        return null;
    }
  };

  const nodeConfig = nodeConfigs[nodeType];

  return (
    <div className="config-panel">
      <div className="config-title">
        Configure {nodeLabel}
      </div>
      
      <div className="space-y-4">
        {Object.entries(nodeConfig).map(([key, fieldConfig]) => (
          <div key={key} className="config-field">
            <label className="config-label">
              {fieldConfig.label}
              {fieldConfig.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            {fieldConfig.description && (
              <p className="text-xs text-gray-500 mb-1">{fieldConfig.description}</p>
            )}
            
            {renderConfigField(key, fieldConfig)}
          </div>
        ))}
      </div>
      
      <div className="flex gap-2 mt-6">
        <button
          className="btn-primary flex-1"
          onClick={handleSave}
          disabled={!hasChanges}
        >
          Save Changes
        </button>
        <button
          className="btn-secondary"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default NodeConfigPanel;
