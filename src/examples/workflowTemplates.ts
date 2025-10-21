import { Workflow, NodeType, NodeStatus } from '../types';

export const exampleWorkflows: Workflow[] = [
  {
    id: 'web-scraping-example',
    name: 'Web Scraping & Analysis',
    description: 'Scrape a website and analyze its content with AI',
    nodes: [
      {
        id: 'input-1',
        type: NodeType.DATA_INPUT,
        position: { x: 100, y: 100 },
        data: {
          label: 'Website URL',
          status: NodeStatus.IDLE,
          config: {
            inputType: 'url',
            placeholder: 'https://example.com',
            required: true
          }
        }
      },
      {
        id: 'scraper-1',
        type: NodeType.WEB_SCRAPING,
        position: { x: 300, y: 100 },
        data: {
          label: 'Web Scraper',
          status: NodeStatus.IDLE,
          config: {
            maxLength: 500,
            includeImages: false
          }
        }
      },
      {
        id: 'llm-1',
        type: NodeType.LLM_TASK,
        position: { x: 500, y: 100 },
        data: {
          label: 'Content Analyzer',
          status: NodeStatus.IDLE,
          config: {
            prompt: 'Analyze the following website content and provide insights about its main topics, tone, and key information.',
            model: 'gpt-3.5-turbo',
            temperature: 0.7,
            maxTokens: 1000
          }
        }
      },
      {
        id: 'output-1',
        type: NodeType.DATA_OUTPUT,
        position: { x: 700, y: 100 },
        data: {
          label: 'Analysis Results',
          status: NodeStatus.IDLE,
          config: {
            outputFormat: 'json',
            filename: 'analysis-results.json',
            includeMetadata: true
          }
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
  {
    id: 'embedding-search-example',
    name: 'Semantic Search Pipeline',
    description: 'Generate embeddings and perform similarity search',
    nodes: [
      {
        id: 'input-2',
        type: NodeType.DATA_INPUT,
        position: { x: 100, y: 200 },
        data: {
          label: 'Search Query',
          status: NodeStatus.IDLE,
          config: {
            inputType: 'text',
            placeholder: 'Enter your search query...',
            required: true
          }
        }
      },
      {
        id: 'embedding-1',
        type: NodeType.EMBEDDING_GENERATOR,
        position: { x: 300, y: 200 },
        data: {
          label: 'Embedding Generator',
          status: NodeStatus.IDLE,
          config: {
            model: 'text-embedding-ada-002',
            dimensions: 1536,
            normalize: true
          }
        }
      },
      {
        id: 'search-1',
        type: NodeType.SIMILARITY_SEARCH,
        position: { x: 500, y: 200 },
        data: {
          label: 'Similarity Search',
          status: NodeStatus.IDLE,
          config: {
            vectorStore: 'vs_example_store',
            topK: 5,
            similarityThreshold: 0.7
          }
        }
      },
      {
        id: 'output-2',
        type: NodeType.DATA_OUTPUT,
        position: { x: 700, y: 200 },
        data: {
          label: 'Search Results',
          status: NodeStatus.IDLE,
          config: {
            outputFormat: 'json',
            filename: 'search-results.json',
            includeMetadata: true
          }
        }
      }
    ],
    edges: [
      { id: 'e4', source: 'input-2', target: 'embedding-1' },
      { id: 'e5', source: 'embedding-1', target: 'search-1' },
      { id: 'e6', source: 'search-1', target: 'output-2' }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const loadExampleWorkflow = (workflowId: string): Workflow | null => {
  return exampleWorkflows.find(w => w.id === workflowId) || null;
};
