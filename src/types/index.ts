export interface WorkflowNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: NodeData;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: Date;
  updatedAt: Date;
}

export enum NodeType {
  WEB_SCRAPING = 'web-scraping',
  STRUCTURED_OUTPUT = 'structured-output',
  EMBEDDING_GENERATOR = 'embedding-generator',
  SIMILARITY_SEARCH = 'similarity-search',
  LLM_TASK = 'llm-task',
  DATA_INPUT = 'data-input',
  DATA_OUTPUT = 'data-output',
}

export interface NodeData {
  label: string;
  status: NodeStatus;
  config: Record<string, any>;
  inputData?: any;
  outputData?: any;
  error?: string;
  executionTime?: number;
}

export enum NodeStatus {
  IDLE = 'idle',
  RUNNING = 'running',
  SUCCESS = 'success',
  ERROR = 'error',
}

export interface ExecutionContext {
  nodeId: string;
  inputData: any;
  config: Record<string, any>;
  workflowId: string;
}

export interface ExecutionResult {
  nodeId: string;
  status: NodeStatus;
  outputData?: any;
  error?: string;
  executionTime: number;
  logs: string[];
}

export interface NodeConfig {
  [key: string]: {
    type: 'string' | 'number' | 'boolean' | 'select' | 'textarea';
    label: string;
    required?: boolean;
    defaultValue?: any;
    options?: string[];
    placeholder?: string;
    description?: string;
  };
}
