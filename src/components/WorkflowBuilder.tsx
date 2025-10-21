import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  ReactFlowProvider,
  ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';

import CustomNode from './CustomNode';
import NodePalette from './NodePalette';
import NodeConfigPanel from './NodeConfigPanel';
import ExecutionPanel from './ExecutionPanel';
import TemplateLoader from './TemplateLoader';
import { NodeType, NodeStatus, Workflow, ExecutionResult } from '../types';
import { WorkflowExecutor } from '../services/WorkflowExecutor';
import { nodeConfigs } from '../config/nodeConfigs';
import { v4 as uuidv4 } from 'uuid';

const nodeTypes = {
  custom: CustomNode,
};

const WorkflowBuilder: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResults, setExecutionResults] = useState<ExecutionResult[]>([]);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [showTemplateLoader, setShowTemplateLoader] = useState(false);
  
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);
  const executor = useRef(new WorkflowExecutor());

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNode = useCallback((nodeType: NodeType) => {
    const newNode: Node = {
      id: uuidv4(),
      type: 'custom',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        label: nodeConfigs[nodeType] ? Object.keys(nodeConfigs[nodeType])[0] : nodeType,
        status: NodeStatus.IDLE,
        config: {},
        inputData: null,
        outputData: null,
      },
    };

    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
    setIsConfigPanelOpen(true);
  }, []);

  const onConfigChange = useCallback((nodeId: string, config: Record<string, any>) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, config } }
          : node
      )
    );
    setIsConfigPanelOpen(false);
    setSelectedNodeId(null);
  }, [setNodes]);

  const onCloseConfigPanel = useCallback(() => {
    setIsConfigPanelOpen(false);
    setSelectedNodeId(null);
  }, []);

  const startExecution = useCallback(async () => {
    if (nodes.length === 0) return;
    
    setIsExecuting(true);
    setExecutionResults([]);
    setExecutionLogs([]);
    
    try {
      const results = await executor.current.executeWorkflow(nodes, edges);
      setExecutionResults(results);
      setExecutionLogs(executor.current.getExecutionLogs());
      
      // Update node statuses based on results
      setNodes((nds) =>
        nds.map((node) => {
          const result = results.find(r => r.nodeId === node.id);
          if (result) {
            return {
              ...node,
              data: {
                ...node.data,
                status: result.status,
                outputData: result.outputData,
                error: result.error,
                executionTime: result.executionTime,
              },
            };
          }
          return node;
        })
      );
    } catch (error) {
      console.error('Execution failed:', error);
    } finally {
      setIsExecuting(false);
    }
  }, [nodes, edges, setNodes]);

  const stopExecution = useCallback(() => {
    setIsExecuting(false);
  }, []);

  const exportResults = useCallback(() => {
    const dataStr = JSON.stringify(executionResults, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'workflow-results.json';
    link.click();
    URL.revokeObjectURL(url);
  }, [executionResults]);

  const exportWorkflow = useCallback(() => {
    const workflow: Workflow = {
      id: uuidv4(),
      name: workflowName,
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.data.label as NodeType,
        position: node.position,
        data: node.data,
      })),
      edges,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const dataStr = JSON.stringify(workflow, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${workflowName.replace(/\s+/g, '-').toLowerCase()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [workflowName, nodes, edges]);

  const loadTemplate = useCallback((template: Workflow) => {
    const templateNodes: Node[] = template.nodes.map(node => ({
      id: node.id,
      type: 'custom',
      position: node.position,
      data: node.data,
    }));
    
    setNodes(templateNodes);
    setEdges(template.edges);
    setWorkflowName(template.name);
  }, [setNodes, setEdges]);

  const selectedNode = selectedNodeId ? nodes.find(n => n.id === selectedNodeId) : null;

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-900">Agent Workflow Builder</h1>
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              className="btn-secondary"
              onClick={() => setShowTemplateLoader(true)}
            >
              Load Template
            </button>
            <button
              className="btn-secondary"
              onClick={exportWorkflow}
            >
              Export Workflow
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Node Palette */}
        <NodePalette onAddNode={addNode} />

        {/* Canvas Area */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-left"
            onInit={(instance) => {
              reactFlowInstance.current = instance;
            }}
          >
            <Background />
            <Controls />
          </ReactFlow>

          {/* Configuration Panel Overlay */}
          {isConfigPanelOpen && selectedNode && (
            <div className="absolute top-4 right-4 z-10">
              <NodeConfigPanel
                nodeId={selectedNode.id}
                nodeType={selectedNode.data.label as NodeType}
                nodeLabel={selectedNode.data.label}
                config={selectedNode.data.config}
                onConfigChange={onConfigChange}
                onClose={onCloseConfigPanel}
              />
            </div>
          )}
        </div>
      </div>

      {/* Execution Panel */}
      <ExecutionPanel
        isExecuting={isExecuting}
        executionResults={executionResults}
        executionLogs={executionLogs}
        onStartExecution={startExecution}
        onStopExecution={stopExecution}
        onExportResults={exportResults}
      />

      {/* Template Loader Modal */}
      {showTemplateLoader && (
        <TemplateLoader
          onLoadTemplate={loadTemplate}
          onClose={() => setShowTemplateLoader(false)}
        />
      )}
    </div>
  );
};

const WorkflowBuilderWithProvider: React.FC = () => {
  return (
    <ReactFlowProvider>
      <WorkflowBuilder />
    </ReactFlowProvider>
  );
};

export default WorkflowBuilderWithProvider;
