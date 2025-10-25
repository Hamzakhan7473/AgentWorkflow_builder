import { Workflow, NodeType, NodeStatus } from '../types';

export interface DeploymentConfig {
  agentName: string;
  description: string;
  isPublic: boolean;
  webhookUrl?: string;
  apiKey?: string;
  rateLimit?: number;
  allowedDomains?: string[];
}

export interface DeploymentResult {
  agentId: string;
  agentUrl: string;
  status: 'deployed' | 'deploying' | 'failed';
  deploymentTime: number;
  webhookUrl?: string;
  apiEndpoint?: string;
  dashboardUrl?: string;
  error?: string;
}

export interface AgentInstance {
  id: string;
  name: string;
  description: string;
  workflow: Workflow;
  config: DeploymentConfig;
  status: 'active' | 'paused' | 'stopped';
  createdAt: Date;
  lastUsed: Date;
  usageCount: number;
  url: string;
}

export class AgentDeploymentService {
  private deployedAgents: Map<string, AgentInstance> = new Map();
  private deploymentQueue: Array<{ workflow: Workflow; config: DeploymentConfig }> = [];
  private sampleAgentsInitialized: boolean = false;

  constructor() {
    console.log('AgentDeploymentService: Initializing service');
  }

  private initializeSampleAgents() {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    
    const sampleAgent: AgentInstance = {
      id: 'agent_n2kkyoxc7',
      name: 'Taxora AI Analyzer',
      description: 'Analyzes taxora.ai website content and generates insights',
      workflow: {
        id: 'sample-workflow',
        name: 'Taxora Analysis',
        description: 'Sample workflow for testing',
        nodes: [
          {
            id: 'input-1',
            type: NodeType.DATA_INPUT,
            position: { x: 100, y: 100 },
            data: {
              label: 'Website URL',
              status: NodeStatus.IDLE,
              config: { inputType: 'url' }
            }
          },
          {
            id: 'scraper-1',
            type: NodeType.WEB_SCRAPING,
            position: { x: 300, y: 100 },
            data: {
              label: 'Web Scraper',
              status: NodeStatus.IDLE,
              config: { url: 'https://taxora.ai' }
            }
          },
          {
            id: 'llm-1',
            type: NodeType.LLM_TASK,
            position: { x: 500, y: 100 },
            data: {
              label: 'AI Analyzer',
              status: NodeStatus.IDLE,
              config: { prompt: 'Analyze this website content' }
            }
          },
          {
            id: 'output-1',
            type: NodeType.DATA_OUTPUT,
            position: { x: 700, y: 100 },
            data: {
              label: 'Results',
              status: NodeStatus.IDLE,
              config: { outputFormat: 'json' }
            }
          }
        ],
        edges: [
          { id: 'e1', source: 'input-1', target: 'scraper-1' },
          { id: 'e2', source: 'scraper-1', target: 'llm-1' },
          { id: 'e3', source: 'llm-1', target: 'output-1' }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      config: {
        agentName: 'Taxora AI Analyzer',
        description: 'Analyzes taxora.ai website content and generates insights',
        isPublic: true,
        rateLimit: 100
      },
      status: 'active',
      createdAt: new Date(),
      lastUsed: new Date(),
      usageCount: 5,
      url: `${baseUrl}/agent/agent_n2kkyoxc7`
    };

    this.deployedAgents.set('agent_n2kkyoxc7', sampleAgent);
    console.log('AgentDeploymentService: Sample agent created with ID:', sampleAgent.id);
  }

  async deployAgent(workflow: Workflow, config: DeploymentConfig): Promise<DeploymentResult> {
    const startTime = Date.now();
    
    try {
      // Validate workflow
      this.validateWorkflow(workflow);
      
      // Generate unique agent ID
      const agentId = this.generateAgentId();
      
      // Create agent URL
      const agentUrl = this.generateAgentUrl(agentId);
      
      // Simulate deployment process
      await this.simulateDeployment(workflow, config);
      
      // Create agent instance
      const agentInstance: AgentInstance = {
        id: agentId,
        name: config.agentName,
        description: config.description,
        workflow,
        config,
        status: 'active',
        createdAt: new Date(),
        lastUsed: new Date(),
        usageCount: 0,
        url: agentUrl
      };
      
      // Store agent
      this.deployedAgents.set(agentId, agentInstance);
      
      const deploymentTime = Date.now() - startTime;
      
      return {
        agentId,
        agentUrl,
        status: 'deployed',
        deploymentTime,
        webhookUrl: `${agentUrl}/webhook`,
        apiEndpoint: `${agentUrl}/api`,
        dashboardUrl: `${agentUrl}/dashboard`
      };
      
    } catch (error) {
      const deploymentTime = Date.now() - startTime;
      return {
        agentId: '',
        agentUrl: '',
        status: 'failed',
        deploymentTime,
        error: error instanceof Error ? error.message : 'Unknown deployment error'
      };
    }
  }

  async executeAgent(agentId: string, inputData: any): Promise<any> {
    const agent = this.deployedAgents.get(agentId);
    if (!agent) {
      throw new Error('Agent not found');
    }
    
    if (agent.status !== 'active') {
      throw new Error('Agent is not active');
    }
    
    // Update usage stats
    agent.lastUsed = new Date();
    agent.usageCount++;
    
    // Simulate agent execution
    return this.simulateAgentExecution(agent.workflow, inputData);
  }

  getAgent(agentId: string): AgentInstance | null {
    // Initialize sample agents if not done yet
    if (!this.sampleAgentsInitialized) {
      this.initializeSampleAgents();
      this.sampleAgentsInitialized = true;
    }
    
    console.log('AgentDeploymentService: Getting agent with ID:', agentId);
    console.log('AgentDeploymentService: Available agents:', Array.from(this.deployedAgents.keys()));
    const agent = this.deployedAgents.get(agentId) || null;
    console.log('AgentDeploymentService: Found agent:', agent);
    return agent;
  }

  getAllAgents(): AgentInstance[] {
    return Array.from(this.deployedAgents.values());
  }

  pauseAgent(agentId: string): boolean {
    const agent = this.deployedAgents.get(agentId);
    if (agent) {
      agent.status = 'paused';
      return true;
    }
    return false;
  }

  resumeAgent(agentId: string): boolean {
    const agent = this.deployedAgents.get(agentId);
    if (agent) {
      agent.status = 'active';
      return true;
    }
    return false;
  }

  deleteAgent(agentId: string): boolean {
    return this.deployedAgents.delete(agentId);
  }

  private validateWorkflow(workflow: Workflow): void {
    if (!workflow.nodes || workflow.nodes.length === 0) {
      throw new Error('Workflow must have at least one node');
    }
    
    // Check for required node types
    const hasInputNode = workflow.nodes.some(node => node.type === NodeType.DATA_INPUT);
    const hasOutputNode = workflow.nodes.some(node => node.type === NodeType.DATA_OUTPUT);
    
    if (!hasInputNode) {
      throw new Error('Workflow must have at least one Data Input node');
    }
    
    if (!hasOutputNode) {
      throw new Error('Workflow must have at least one Data Output node');
    }
    
    // Validate node configurations
    for (const node of workflow.nodes) {
      this.validateNodeConfig(node);
    }
  }

  private validateNodeConfig(node: any): void {
    // Basic validation - in a real implementation, this would be more comprehensive
    if (!node.data || !node.data.label) {
      throw new Error(`Node ${node.id} is missing required configuration`);
    }
  }

  private generateAgentId(): string {
    return 'agent_' + Math.random().toString(36).substr(2, 9);
  }

  private generateAgentUrl(agentId: string): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}/agent/${agentId}`;
  }

  private async simulateDeployment(workflow: Workflow, config: DeploymentConfig): Promise<void> {
    // Simulate deployment steps
    const steps = [
      'Validating workflow...',
      'Creating agent instance...',
      'Setting up API endpoints...',
      'Configuring webhooks...',
      'Deploying to cloud...',
      'Testing agent functionality...',
      'Agent deployed successfully!'
    ];
    
    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log(`Deployment: ${step}`);
    }
  }

  private async simulateAgentExecution(workflow: Workflow, inputData: any): Promise<any> {
    // Simulate agent execution with realistic delays
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate realistic response based on workflow
    const hasWebScraping = workflow.nodes.some(node => node.type === NodeType.WEB_SCRAPING);
    const hasLLM = workflow.nodes.some(node => node.type === NodeType.LLM_TASK);
    
    if (hasWebScraping && hasLLM) {
      return {
        success: true,
        result: {
          type: 'content_analysis',
          data: {
            summary: 'Content successfully analyzed and processed',
            insights: [
              'Key topics identified and categorized',
              'Sentiment analysis completed',
              'Actionable recommendations generated'
            ],
            metadata: {
              processedAt: new Date().toISOString(),
              confidence: 0.95,
              processingTime: '1.2s'
            }
          }
        }
      };
    } else if (hasLLM) {
      return {
        success: true,
        result: {
          type: 'ai_response',
          data: {
            response: 'AI agent has successfully processed your request and generated a comprehensive response.',
            metadata: {
              processedAt: new Date().toISOString(),
              model: 'gpt-4',
              tokens: 150
            }
          }
        }
      };
    } else {
      return {
        success: true,
        result: {
          type: 'data_processing',
          data: {
            message: 'Data successfully processed by agent',
            processedData: inputData,
            metadata: {
              processedAt: new Date().toISOString(),
              processingTime: '0.8s'
            }
          }
        }
      };
    }
  }

  // Get deployment statistics
  getDeploymentStats(): {
    totalAgents: number;
    activeAgents: number;
    pausedAgents: number;
    totalExecutions: number;
    averageExecutionTime: number;
  } {
    const agents = Array.from(this.deployedAgents.values());
    const totalExecutions = agents.reduce((sum, agent) => sum + agent.usageCount, 0);
    
    return {
      totalAgents: agents.length,
      activeAgents: agents.filter(a => a.status === 'active').length,
      pausedAgents: agents.filter(a => a.status === 'paused').length,
      totalExecutions,
      averageExecutionTime: 1.2 // Mock average
    };
  }
}

// Export singleton instance
export const agentDeploymentService = new AgentDeploymentService();
