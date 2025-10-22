import React, { useState, useCallback, useRef, useEffect } from 'react';
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
  MiniMap,
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
import { 
  Play, 
  Square, 
  Download, 
  Upload, 
  Settings, 
  HelpCircle, 
  Zap,
  Save,
  FolderOpen,
  Trash2,
  Copy,
  Undo,
  Redo
} from 'lucide-react';

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
  const [showWelcome, setShowWelcome] = useState(true);
  const [history, setHistory] = useState<{nodes: Node[], edges: Edge[]}[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isExecutionPanelMinimized, setIsExecutionPanelMinimized] = useState(false);
  
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);
  const executor = useRef(new WorkflowExecutor());

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 's':
            event.preventDefault();
            exportWorkflow();
            break;
          case 'z':
            event.preventDefault();
            undo();
            break;
          case 'y':
            event.preventDefault();
            redo();
            break;
          case 'n':
            event.preventDefault();
            setShowTemplateLoader(true);
            break;
        }
      }
      if (event.key === 'Delete' && selectedNodeId) {
        deleteNode(selectedNodeId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId]);

  // History management
  const saveToHistory = useCallback(() => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ nodes: [...nodes], edges: [...edges] });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [nodes, edges, history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
      setHistoryIndex(historyIndex - 1);
    }
  }, [history, historyIndex, setNodes, setEdges]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setHistoryIndex(historyIndex + 1);
    }
  }, [history, historyIndex, setNodes, setEdges]);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes(nodes => nodes.filter(node => node.id !== nodeId));
    setEdges(edges => edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId));
    setSelectedNodeId(null);
    setIsConfigPanelOpen(false);
  }, [setNodes, setEdges]);

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

    setNodes((nds) => {
      const newNodes = [...nds, newNode];
      saveToHistory();
      return newNodes;
    });
    setShowWelcome(false);
  }, [setNodes, saveToHistory]);

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
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Enhanced Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    <span className="gradient-text">Agent</span> Workflow Builder
                  </h1>
                  <p className="text-sm text-gray-500">Built for Speed • No-Code Friendly • Easy Onboarding</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-8">
                <input
                  type="text"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm font-medium"
                />
                <button
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                  title="Save workflow (Ctrl+S)"
                >
                  <Save className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* History Controls */}
              <div className="flex items-center gap-1 mr-4">
                <button
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  title="Undo (Ctrl+Z)"
                >
                  <Undo className="w-4 h-4" />
                </button>
                <button
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  title="Redo (Ctrl+Y)"
                >
                  <Redo className="w-4 h-4" />
                </button>
              </div>
              
              {/* Main Actions */}
              <button
                className="btn-secondary flex items-center gap-2"
                onClick={() => setShowTemplateLoader(true)}
                title="Load template (Ctrl+N)"
              >
                <FolderOpen className="w-4 h-4" />
                Templates
              </button>
              
              <button
                className="btn-secondary flex items-center gap-2"
                onClick={exportWorkflow}
                title="Export workflow (Ctrl+S)"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              
              <button
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                title="Help & Shortcuts"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Node Palette */}
        <NodePalette onAddNode={addNode} />

        {/* Canvas Area */}
        <div className="flex-1 relative">
          {showWelcome && nodes.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
              <div className="text-center max-w-md mx-auto p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  <span className="gradient-text">Automate Smarter</span>
                </h2>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Grow Faster. Bolder.</h3>
                <p className="text-gray-600 mb-6 max-w-md">
                  Unlock your team's full potential with AI agents that save time, cut costs, and scale with you — no code, no clutter, just results.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    className="btn-primary flex items-center gap-2"
                    onClick={() => setShowTemplateLoader(true)}
                  >
                    <FolderOpen className="w-4 h-4" />
                    Load Template
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => setShowWelcome(false)}
                  >
                    Start Blank
                  </button>
                </div>
                <div className="mt-6 text-sm text-gray-500">
                  <p className="mb-2 font-medium">Quick Start:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <span>Ctrl+N - Load template</span>
                    <span>Ctrl+S - Export workflow</span>
                    <span>Ctrl+Z - Undo</span>
                    <span>Ctrl+Y - Redo</span>
                    <span>Delete - Remove selected node</span>
                    <span>Double-click - Configure node</span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          
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
            <Background variant="dots" gap={20} size={1} />
            <Controls />
            <MiniMap 
              nodeColor={(node) => {
                switch (node.data?.status) {
                  case NodeStatus.SUCCESS: return '#10B981';
                  case NodeStatus.ERROR: return '#EF4444';
                  case NodeStatus.RUNNING: return '#3B82F6';
                  default: return '#6B7280';
                }
              }}
              nodeStrokeWidth={3}
              zoomable
              pannable
            />
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
      {!isExecutionPanelMinimized ? (
        <ExecutionPanel
          isExecuting={isExecuting}
          executionResults={executionResults}
          executionLogs={executionLogs}
          onStartExecution={startExecution}
          onStopExecution={stopExecution}
          onExportResults={exportResults}
          onMinimize={() => setIsExecutionPanelMinimized(true)}
        />
      ) : (
        <div className="bg-white border-t border-gray-200 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Execution Panel</span>
          </div>
          <button
            onClick={() => setIsExecutionPanelMinimized(false)}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
            title="Expand execution panel"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}

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
