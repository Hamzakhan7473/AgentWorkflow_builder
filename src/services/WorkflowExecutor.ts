import { 
  ExecutionContext, 
  ExecutionResult, 
  NodeStatus, 
  NodeType,
  WorkflowNode,
  WorkflowEdge 
} from '../types';

export class WorkflowExecutor {
  private executionLogs: string[] = [];
  private isExecuting = false;

  async executeWorkflow(
    nodes: WorkflowNode[], 
    edges: WorkflowEdge[], 
    inputData: any = {}
  ): Promise<ExecutionResult[]> {
    this.isExecuting = true;
    this.executionLogs = [];
    const results: ExecutionResult[] = [];
    
    try {
      // Find entry nodes (nodes with no incoming edges)
      const entryNodes = this.findEntryNodes(nodes, edges);
      
      // Execute nodes in topological order
      const executionOrder = this.getExecutionOrder(nodes, edges);
      
      for (const nodeId of executionOrder) {
        const node = nodes.find(n => n.id === nodeId);
        if (!node) continue;
        
        const result = await this.executeNode(node, inputData, results);
        results.push(result);
        
        if (result.status === NodeStatus.ERROR) {
          this.log(`Error in node ${nodeId}: ${result.error}`);
          break;
        }
      }
    } catch (error) {
      this.log(`Workflow execution failed: ${error}`);
    } finally {
      this.isExecuting = false;
    }
    
    return results;
  }

  private async executeNode(
    node: WorkflowNode, 
    inputData: any, 
    previousResults: ExecutionResult[]
  ): Promise<ExecutionResult> {
    const startTime = Date.now();
    const nodeType = node.data.nodeType || node.type as NodeType;
    this.log(`Executing node: ${node.data.label} (${nodeType})`);
    
    try {
      // Get input data for this node
      const nodeInputData = this.getNodeInputData(node, inputData, previousResults);
      
      // Execute based on node type
      const outputData = await this.executeNodeByType(nodeType, nodeInputData, node.data.config);
      
      const executionTime = Date.now() - startTime;
      this.log(`Node ${node.data.label} completed successfully in ${executionTime}ms`);
      
      return {
        nodeId: node.id,
        status: NodeStatus.SUCCESS,
        outputData,
        executionTime,
        logs: [...this.executionLogs]
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;
      this.log(`Node ${node.data.label} failed: ${error}`);
      
      return {
        nodeId: node.id,
        status: NodeStatus.ERROR,
        error: error instanceof Error ? error.message : String(error),
        executionTime,
        logs: [...this.executionLogs]
      };
    }
  }

  private async executeNodeByType(
    nodeType: NodeType, 
    inputData: any, 
    config: Record<string, any>
  ): Promise<any> {
    switch (nodeType) {
      case NodeType.WEB_SCRAPING:
        return this.executeWebScraping(inputData, config);
      case NodeType.STRUCTURED_OUTPUT:
        return this.executeStructuredOutput(inputData, config);
      case NodeType.EMBEDDING_GENERATOR:
        return this.executeEmbeddingGenerator(inputData, config);
      case NodeType.SIMILARITY_SEARCH:
        return this.executeSimilaritySearch(inputData, config);
      case NodeType.LLM_TASK:
        return this.executeLLMTask(inputData, config);
      case NodeType.DATA_INPUT:
        return this.executeDataInput(inputData, config);
      case NodeType.DATA_OUTPUT:
        return this.executeDataOutput(inputData, config);
      default:
        throw new Error(`Unknown node type: ${nodeType}`);
    }
  }

  private async executeWebScraping(inputData: any, config: Record<string, any>): Promise<any> {
    // Mock implementation - in a real app, you'd use a web scraping service
    const url = config.url || inputData.url;
    if (!url) throw new Error('URL is required for web scraping');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate realistic mock data based on URL
    const isTaxora = url.includes('taxora.ai');
    const title = isTaxora 
      ? 'Taxora - AI-Powered Tax Solutions for Modern Businesses'
      : `Scraped content from ${url}`;
    
    const summary = isTaxora
      ? `Taxora is an innovative AI-powered platform that revolutionizes tax management for businesses and individuals. The platform offers comprehensive tax preparation, compliance monitoring, and optimization services using advanced machine learning algorithms. Key features include automated tax calculations, real-time compliance tracking, intelligent document processing, and personalized tax strategies. The website showcases modern design with clear value propositions, customer testimonials, and detailed service offerings. The platform emphasizes ease of use, accuracy, and significant time savings for tax-related tasks.`
      : `This is a comprehensive summary of the content from ${url}. The website contains valuable information including main topics, key insights, and structured data that has been processed and analyzed according to the specified parameters. The content covers various aspects of the site's purpose and functionality.`;
    
    return {
      url,
      title,
      summary,
      content: `Full extracted content from ${url} including all text, headings, and structured data...`,
      timestamp: new Date().toISOString(),
      metadata: {
        wordCount: Math.floor(Math.random() * 2000) + 500,
        language: 'en',
        contentType: 'website',
        scrapedAt: new Date().toISOString()
      }
    };
  }

  private async executeStructuredOutput(inputData: any, config: Record<string, any>): Promise<any> {
    // Mock implementation - in a real app, you'd use OpenAI's structured output API
    const schema = config.schema;
    if (!schema) throw new Error('Schema is required for structured output');
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      structured: {
        title: "Extracted Title",
        content: "Extracted content based on schema",
        metadata: {
          confidence: 0.95,
          timestamp: new Date().toISOString()
        }
      },
      raw: inputData
    };
  }

  private async executeEmbeddingGenerator(inputData: any, config: Record<string, any>): Promise<any> {
    // Mock implementation - in a real app, you'd use OpenAI's embedding API
    const text = inputData.text || inputData.content || inputData;
    if (!text) throw new Error('Text is required for embedding generation');
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Generate mock embedding vector
    const dimensions = config.dimensions || 1536;
    const embedding = Array.from({ length: dimensions }, () => Math.random() * 2 - 1);
    
    return {
      embedding,
      text,
      dimensions,
      model: config.model || 'text-embedding-ada-002'
    };
  }

  private async executeSimilaritySearch(inputData: any, config: Record<string, any>): Promise<any> {
    // Mock implementation - in a real app, you'd query a vector database
    const vectorStore = config.vectorStore;
    if (!vectorStore) throw new Error('Vector store ID is required for similarity search');
    
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const topK = config.topK || 5;
    const results = Array.from({ length: topK }, (_, i) => ({
      id: `result_${i + 1}`,
      content: `Similar content ${i + 1}`,
      similarity: 0.9 - (i * 0.1),
      metadata: {
        source: `document_${i + 1}`,
        timestamp: new Date().toISOString()
      }
    }));
    
    return {
      results,
      query: inputData,
      vectorStore,
      topK
    };
  }

  private async executeLLMTask(inputData: any, config: Record<string, any>): Promise<any> {
    // Mock implementation - in a real app, you'd use OpenAI's API
    const prompt = config.prompt;
    if (!prompt) throw new Error('Prompt is required for LLM task');
    
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Generate realistic responses based on prompt content
    let response = '';
    if (prompt.toLowerCase().includes('analyze') || prompt.toLowerCase().includes('analysis')) {
      response = `Based on the provided data, here's my comprehensive analysis:

**Key Insights:**
• The data reveals significant patterns and trends that indicate strong potential for optimization
• Critical metrics show consistent performance with room for improvement in specific areas
• Strategic recommendations include focusing on high-impact initiatives and streamlining processes

**Detailed Findings:**
The analysis indicates that the current approach is fundamentally sound but could benefit from targeted enhancements. The data suggests implementing a phased improvement strategy that addresses both immediate needs and long-term objectives.

**Recommendations:**
1. Prioritize high-impact initiatives that align with core business objectives
2. Implement monitoring systems to track progress and measure success
3. Consider leveraging advanced technologies to automate routine processes

This analysis provides a solid foundation for strategic decision-making and future planning.`;
    } else if (prompt.toLowerCase().includes('generate') || prompt.toLowerCase().includes('create')) {
      response = `Here's the generated content based on your requirements:

**Professional Content Generated:**

The content has been crafted to meet your specifications, incorporating best practices and industry standards. The generated material includes:

• Compelling headlines and subheadings that capture attention
• Well-structured paragraphs with clear value propositions
• Actionable insights and practical recommendations
• Professional tone that resonates with your target audience

**Key Features:**
- Engaging and informative content that drives engagement
- SEO-optimized structure for better search visibility
- Clear call-to-action elements to guide user behavior
- Consistent messaging that aligns with your brand voice

The generated content is ready for immediate use and can be easily customized to fit specific requirements or platforms.`;
    } else {
      response = `Here's my response to your request:

${prompt}

Based on the input data and your specific requirements, I've provided a comprehensive response that addresses all key points. The response includes relevant insights, practical recommendations, and actionable next steps.

**Summary:**
The analysis covers all requested aspects and provides clear guidance for implementation. The recommendations are based on industry best practices and are designed to deliver measurable results.

**Next Steps:**
1. Review the recommendations and prioritize based on your specific needs
2. Develop an implementation plan with clear timelines and milestones
3. Monitor progress and adjust strategies as needed

This response provides a solid foundation for your decision-making process.`;
    }
    
    return {
      response,
      model: config.model || 'gpt-3.5-turbo',
      usage: {
        promptTokens: Math.floor(Math.random() * 200) + 100,
        completionTokens: Math.floor(Math.random() * 300) + 200,
        totalTokens: Math.floor(Math.random() * 500) + 300
      },
      metadata: {
        temperature: config.temperature || 0.7,
        maxTokens: config.maxTokens || 1000,
        generatedAt: new Date().toISOString()
      }
    };
  }

  private async executeDataInput(inputData: any, config: Record<string, any>): Promise<any> {
    return {
      data: inputData,
      type: config.inputType || 'text',
      timestamp: new Date().toISOString()
    };
  }

  private async executeDataOutput(inputData: any, config: Record<string, any>): Promise<any> {
    return {
      output: inputData,
      format: config.outputFormat || 'json',
      filename: config.filename || 'output.json',
      timestamp: new Date().toISOString()
    };
  }

  private getNodeInputData(
    node: WorkflowNode, 
    initialInput: any, 
    previousResults: ExecutionResult[]
  ): any {
    // For now, return the initial input data
    // In a real implementation, you'd process the data flow through edges
    return initialInput;
  }

  private findEntryNodes(nodes: WorkflowNode[], edges: WorkflowEdge[]): WorkflowNode[] {
    const nodeIds = new Set(nodes.map(n => n.id));
    const targetIds = new Set(edges.map(e => e.target));
    
    return nodes.filter(node => !targetIds.has(node.id));
  }

  private getExecutionOrder(nodes: WorkflowNode[], edges: WorkflowEdge[]): string[] {
    // Simple topological sort implementation
    const inDegree = new Map<string, number>();
    const graph = new Map<string, string[]>();
    
    // Initialize
    nodes.forEach(node => {
      inDegree.set(node.id, 0);
      graph.set(node.id, []);
    });
    
    // Build graph and calculate in-degrees
    edges.forEach(edge => {
      const currentInDegree = inDegree.get(edge.target) || 0;
      inDegree.set(edge.target, currentInDegree + 1);
      
      const neighbors = graph.get(edge.source) || [];
      neighbors.push(edge.target);
      graph.set(edge.source, neighbors);
    });
    
    // Topological sort
    const queue: string[] = [];
    const result: string[] = [];
    
    inDegree.forEach((degree, nodeId) => {
      if (degree === 0) {
        queue.push(nodeId);
      }
    });
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      result.push(current);
      
      const neighbors = graph.get(current) || [];
      neighbors.forEach(neighbor => {
        const newInDegree = (inDegree.get(neighbor) || 0) - 1;
        inDegree.set(neighbor, newInDegree);
        
        if (newInDegree === 0) {
          queue.push(neighbor);
        }
      });
    }
    
    return result;
  }

  private log(message: string): void {
    const timestamp = new Date().toISOString();
    this.executionLogs.push(`[${timestamp}] ${message}`);
  }

  getExecutionLogs(): string[] {
    return [...this.executionLogs];
  }

  isCurrentlyExecuting(): boolean {
    return this.isExecuting;
  }
}

