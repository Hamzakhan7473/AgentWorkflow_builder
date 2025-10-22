import { NodeConfig, NodeType } from '../types';
import { 
  Globe, 
  FileText, 
  Hash, 
  Search, 
  Bot, 
  Download, 
  Upload 
} from 'lucide-react';

export const nodeConfigs: Record<NodeType, NodeConfig> = {
  [NodeType.WEB_SCRAPING]: {
    url: {
      type: 'string',
      label: 'Website URL',
      required: true,
      placeholder: 'https://example.com',
      description: 'The URL of the website to scrape'
    },
    maxLength: {
      type: 'number',
      label: 'Max Summary Length',
      defaultValue: 500,
      description: 'Maximum length of the generated summary'
    },
    includeImages: {
      type: 'boolean',
      label: 'Include Images',
      defaultValue: false,
      description: 'Whether to include image descriptions in the summary'
    }
  },
  
  [NodeType.STRUCTURED_OUTPUT]: {
    schema: {
      type: 'textarea',
      label: 'JSON Schema',
      required: true,
      placeholder: '{"type": "object", "properties": {...}}',
      description: 'JSON schema defining the expected output structure'
    },
    model: {
      type: 'select',
      label: 'Model',
      defaultValue: 'gpt-3.5-turbo',
      options: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo'],
      description: 'OpenAI model to use for structured output generation'
    },
    temperature: {
      type: 'number',
      label: 'Temperature',
      defaultValue: 0.1,
      description: 'Controls randomness in the output (0-1)'
    }
  },
  
  [NodeType.EMBEDDING_GENERATOR]: {
    model: {
      type: 'select',
      label: 'Embedding Model',
      defaultValue: 'text-embedding-ada-002',
      options: ['text-embedding-ada-002', 'text-embedding-3-small', 'text-embedding-3-large'],
      description: 'OpenAI embedding model to use'
    },
    dimensions: {
      type: 'number',
      label: 'Dimensions',
      defaultValue: 1536,
      description: 'Number of dimensions for the embedding vector'
    },
    normalize: {
      type: 'boolean',
      label: 'Normalize Vectors',
      defaultValue: true,
      description: 'Whether to normalize the embedding vectors'
    }
  },
  
  [NodeType.SIMILARITY_SEARCH]: {
    vectorStore: {
      type: 'string',
      label: 'Vector Store ID',
      required: true,
      placeholder: 'vs_1234567890',
      description: 'ID of the vector store to search in'
    },
    topK: {
      type: 'number',
      label: 'Top K Results',
      defaultValue: 5,
      description: 'Number of similar items to return'
    },
    similarityThreshold: {
      type: 'number',
      label: 'Similarity Threshold',
      defaultValue: 0.7,
      description: 'Minimum similarity score (0-1)'
    },
    filter: {
      type: 'textarea',
      label: 'Filter Expression',
      placeholder: '{"category": "news"}',
      description: 'Optional filter to apply to the search'
    }
  },
  
  [NodeType.LLM_TASK]: {
    prompt: {
      type: 'textarea',
      label: 'System Prompt',
      required: true,
      placeholder: 'You are a helpful assistant...',
      description: 'The system prompt for the LLM task'
    },
    model: {
      type: 'select',
      label: 'Model',
      defaultValue: 'gpt-3.5-turbo',
      options: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo'],
      description: 'OpenAI model to use'
    },
    temperature: {
      type: 'number',
      label: 'Temperature',
      defaultValue: 0.7,
      description: 'Controls randomness in the output (0-1)'
    },
    maxTokens: {
      type: 'number',
      label: 'Max Tokens',
      defaultValue: 1000,
      description: 'Maximum number of tokens to generate'
    }
  },
  
  [NodeType.DATA_INPUT]: {
    inputType: {
      type: 'select',
      label: 'Input Type',
      defaultValue: 'text',
      options: ['text', 'json', 'url', 'file'],
      description: 'Type of input data expected'
    },
    placeholder: {
      type: 'string',
      label: 'Placeholder Text',
      placeholder: 'Enter your input here...',
      description: 'Placeholder text for the input field'
    },
    required: {
      type: 'boolean',
      label: 'Required',
      defaultValue: true,
      description: 'Whether this input is required'
    }
  },
  
  [NodeType.DATA_OUTPUT]: {
    outputFormat: {
      type: 'select',
      label: 'Output Format',
      defaultValue: 'json',
      options: ['json', 'text', 'csv', 'markdown'],
      description: 'Format of the output data'
    },
    filename: {
      type: 'string',
      label: 'Filename',
      placeholder: 'output.json',
      description: 'Default filename for exported data'
    },
    includeMetadata: {
      type: 'boolean',
      label: 'Include Metadata',
      defaultValue: false,
      description: 'Whether to include execution metadata in output'
    }
  }
};

export const nodeIcons: Record<NodeType, React.ComponentType<any>> = {
  [NodeType.WEB_SCRAPING]: Globe,
  [NodeType.STRUCTURED_OUTPUT]: FileText,
  [NodeType.EMBEDDING_GENERATOR]: Hash,
  [NodeType.SIMILARITY_SEARCH]: Search,
  [NodeType.LLM_TASK]: Bot,
  [NodeType.DATA_INPUT]: Upload,
  [NodeType.DATA_OUTPUT]: Download,
};

export const nodeColors: Record<NodeType, string> = {
  [NodeType.WEB_SCRAPING]: '#3B82F6',
  [NodeType.STRUCTURED_OUTPUT]: '#8B5CF6',
  [NodeType.EMBEDDING_GENERATOR]: '#10B981',
  [NodeType.SIMILARITY_SEARCH]: '#F59E0B',
  [NodeType.LLM_TASK]: '#EF4444',
  [NodeType.DATA_INPUT]: '#6B7280',
  [NodeType.DATA_OUTPUT]: '#6B7280',
};
