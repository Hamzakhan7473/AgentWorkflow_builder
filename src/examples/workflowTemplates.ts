import { Workflow, NodeType, NodeStatus } from '../types';

export const exampleWorkflows: Workflow[] = [
  {
    id: 'content-marketing-automation',
    name: 'Content Marketing Automation',
    description: 'Automatically research topics, generate content, and publish across platforms',
    category: 'Marketing',
    difficulty: 'Beginner',
    estimatedTime: '5 minutes',
    nodes: [
      {
        id: 'input-1',
        type: NodeType.DATA_INPUT,
        position: { x: 100, y: 100 },
        data: {
          label: 'Topic Input',
          status: NodeStatus.IDLE,
          config: {
            inputType: 'text',
            placeholder: 'Enter your content topic (e.g., "AI trends 2024")',
            required: true
          }
        }
      },
      {
        id: 'web-scrape-1',
        type: NodeType.WEB_SCRAPING,
        position: { x: 300, y: 100 },
        data: {
          label: 'Research Topic',
          status: NodeStatus.IDLE,
          config: {
            url: 'https://news.google.com/search?q={{topic}}',
            maxLength: 1000,
            includeImages: false
          }
        }
      },
      {
        id: 'llm-1',
        type: NodeType.LLM_TASK,
        position: { x: 500, y: 100 },
        data: {
          label: 'Generate Content',
          status: NodeStatus.IDLE,
          config: {
            prompt: 'Create engaging blog post content based on this research: {{research_data}}. Include headlines, key points, and a compelling conclusion.',
            model: 'gpt-4',
            temperature: 0.7,
            maxTokens: 2000
          }
        }
      },
      {
        id: 'structured-1',
        type: NodeType.STRUCTURED_OUTPUT,
        position: { x: 700, y: 100 },
        data: {
          label: 'Format Content',
          status: NodeStatus.IDLE,
          config: {
            schema: '{"title": "string", "introduction": "string", "main_points": ["string"], "conclusion": "string", "tags": ["string"]}',
            model: 'gpt-3.5-turbo',
            temperature: 0.3
          }
        }
      },
      {
        id: 'output-1',
        type: NodeType.DATA_OUTPUT,
        position: { x: 900, y: 100 },
        data: {
          label: 'Export Content',
          status: NodeStatus.IDLE,
          config: {
            outputFormat: 'markdown',
            filename: 'content-{{timestamp}}.md',
            includeMetadata: true
          }
        }
      }
    ],
    edges: [
      { id: 'e1-2', source: 'input-1', target: 'web-scrape-1' },
      { id: 'e2-3', source: 'web-scrape-1', target: 'llm-1' },
      { id: 'e3-4', source: 'llm-1', target: 'structured-1' },
      { id: 'e4-5', source: 'structured-1', target: 'output-1' }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'customer-support-automation',
    name: 'Smart Customer Support',
    description: 'Automatically categorize support tickets and generate personalized responses',
    category: 'Customer Service',
    difficulty: 'Beginner',
    estimatedTime: '3 minutes',
    nodes: [
      {
        id: 'input-2',
        type: NodeType.DATA_INPUT,
        position: { x: 100, y: 200 },
        data: {
          label: 'Support Ticket',
          status: NodeStatus.IDLE,
          config: {
            inputType: 'textarea',
            placeholder: 'Paste customer support ticket here...',
            required: true
          }
        }
      },
      {
        id: 'llm-2',
        type: NodeType.LLM_TASK,
        position: { x: 300, y: 200 },
        data: {
          label: 'Analyze Ticket',
          status: NodeStatus.IDLE,
          config: {
            prompt: 'Analyze this customer support ticket and categorize it. Determine urgency level (low/medium/high), category (billing/technical/general), and customer sentiment (positive/neutral/negative). Ticket: {{ticket_content}}',
            model: 'gpt-4',
            temperature: 0.3,
            maxTokens: 500
          }
        }
      },
      {
        id: 'structured-2',
        type: NodeType.STRUCTURED_OUTPUT,
        position: { x: 500, y: 200 },
        data: {
          label: 'Extract Details',
          status: NodeStatus.IDLE,
          config: {
            schema: '{"urgency": "string", "category": "string", "sentiment": "string", "key_issues": ["string"], "suggested_response_type": "string"}',
            model: 'gpt-3.5-turbo',
            temperature: 0.1
          }
        }
      },
      {
        id: 'llm-3',
        type: NodeType.LLM_TASK,
        position: { x: 700, y: 200 },
        data: {
          label: 'Generate Response',
          status: NodeStatus.IDLE,
          config: {
            prompt: 'Generate a professional, helpful customer support response based on this analysis: {{analysis}}. Be empathetic, solution-focused, and maintain a positive tone.',
            model: 'gpt-4',
            temperature: 0.7,
            maxTokens: 300
          }
        }
      },
      {
        id: 'output-2',
        type: NodeType.DATA_OUTPUT,
        position: { x: 900, y: 200 },
        data: {
          label: 'Support Response',
          status: NodeStatus.IDLE,
          config: {
            outputFormat: 'text',
            filename: 'support-response-{{timestamp}}.txt',
            includeMetadata: true
          }
        }
      }
    ],
    edges: [
      { id: 'e1-2', source: 'input-2', target: 'llm-2' },
      { id: 'e2-3', source: 'llm-2', target: 'structured-2' },
      { id: 'e3-4', source: 'structured-2', target: 'llm-3' },
      { id: 'e4-5', source: 'llm-3', target: 'output-2' }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'data-analysis-automation',
    name: 'Automated Data Analysis',
    description: 'Upload data, analyze patterns, and generate insights automatically',
    category: 'Analytics',
    difficulty: 'Intermediate',
    estimatedTime: '7 minutes',
    nodes: [
      {
        id: 'input-3',
        type: NodeType.DATA_INPUT,
        position: { x: 100, y: 300 },
        data: {
          label: 'Data Upload',
          status: NodeStatus.IDLE,
          config: {
            inputType: 'file',
            placeholder: 'Upload CSV, JSON, or paste data here',
            required: true
          }
        }
      },
      {
        id: 'llm-4',
        type: NodeType.LLM_TASK,
        position: { x: 300, y: 300 },
        data: {
          label: 'Data Understanding',
          status: NodeStatus.IDLE,
          config: {
            prompt: 'Analyze this dataset and provide insights. Identify patterns, trends, outliers, and key metrics. Data: {{data_input}}',
            model: 'gpt-4',
            temperature: 0.3,
            maxTokens: 1500
          }
        }
      },
      {
        id: 'structured-3',
        type: NodeType.STRUCTURED_OUTPUT,
        position: { x: 500, y: 300 },
        data: {
          label: 'Extract Insights',
          status: NodeStatus.IDLE,
          config: {
            schema: '{"summary": "string", "key_metrics": ["string"], "trends": ["string"], "outliers": ["string"], "recommendations": ["string"]}',
            model: 'gpt-3.5-turbo',
            temperature: 0.2
          }
        }
      },
      {
        id: 'llm-5',
        type: NodeType.LLM_TASK,
        position: { x: 700, y: 300 },
        data: {
          label: 'Generate Report',
          status: NodeStatus.IDLE,
          config: {
            prompt: 'Create a comprehensive data analysis report based on these insights: {{insights}}. Include executive summary, detailed findings, and actionable recommendations.',
            model: 'gpt-4',
            temperature: 0.5,
            maxTokens: 2000
          }
        }
      },
      {
        id: 'output-3',
        type: NodeType.DATA_OUTPUT,
        position: { x: 900, y: 300 },
        data: {
          label: 'Analysis Report',
          status: NodeStatus.IDLE,
          config: {
            outputFormat: 'markdown',
            filename: 'data-analysis-{{timestamp}}.md',
            includeMetadata: true
          }
        }
      }
    ],
    edges: [
      { id: 'e1-2', source: 'input-3', target: 'llm-4' },
      { id: 'e2-3', source: 'llm-4', target: 'structured-3' },
      { id: 'e3-4', source: 'structured-3', target: 'llm-5' },
      { id: 'e4-5', source: 'llm-5', target: 'output-3' }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'social-media-automation',
    name: 'Social Media Content Creator',
    description: 'Generate engaging social media posts with hashtags and scheduling',
    category: 'Social Media',
    difficulty: 'Beginner',
    estimatedTime: '4 minutes',
    nodes: [
      {
        id: 'input-4',
        type: NodeType.DATA_INPUT,
        position: { x: 100, y: 400 },
        data: {
          label: 'Content Brief',
          status: NodeStatus.IDLE,
          config: {
            inputType: 'textarea',
            placeholder: 'Describe what you want to post about (e.g., "New product launch", "Industry insights")',
            required: true
          }
        }
      },
      {
        id: 'web-scrape-2',
        type: NodeType.WEB_SCRAPING,
        position: { x: 300, y: 400 },
        data: {
          label: 'Trend Research',
          status: NodeStatus.IDLE,
          config: {
            url: 'https://trends.google.com/trends/explore?q={{topic}}',
            maxLength: 500,
            includeImages: false
          }
        }
      },
      {
        id: 'llm-6',
        type: NodeType.LLM_TASK,
        position: { x: 500, y: 400 },
        data: {
          label: 'Create Posts',
          status: NodeStatus.IDLE,
          config: {
            prompt: 'Create engaging social media posts for Twitter, LinkedIn, and Instagram based on this brief: {{brief}} and trends: {{trends}}. Make each platform-specific with appropriate tone and hashtags.',
            model: 'gpt-4',
            temperature: 0.8,
            maxTokens: 1000
          }
        }
      },
      {
        id: 'structured-4',
        type: NodeType.STRUCTURED_OUTPUT,
        position: { x: 700, y: 400 },
        data: {
          label: 'Format Posts',
          status: NodeStatus.IDLE,
          config: {
            schema: '{"twitter": {"content": "string", "hashtags": ["string"]}, "linkedin": {"content": "string", "hashtags": ["string"]}, "instagram": {"content": "string", "hashtags": ["string"]}}',
            model: 'gpt-3.5-turbo',
            temperature: 0.4
          }
        }
      },
      {
        id: 'output-4',
        type: NodeType.DATA_OUTPUT,
        position: { x: 900, y: 400 },
        data: {
          label: 'Social Media Kit',
          status: NodeStatus.IDLE,
          config: {
            outputFormat: 'json',
            filename: 'social-posts-{{timestamp}}.json',
            includeMetadata: true
          }
        }
      }
    ],
    edges: [
      { id: 'e1-2', source: 'input-4', target: 'web-scrape-2' },
      { id: 'e2-3', source: 'web-scrape-2', target: 'llm-6' },
      { id: 'e3-4', source: 'llm-6', target: 'structured-4' },
      { id: 'e4-5', source: 'structured-4', target: 'output-4' }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'email-automation',
    name: 'Smart Email Campaign',
    description: 'Create personalized email campaigns with A/B testing suggestions',
    category: 'Email Marketing',
    difficulty: 'Intermediate',
    estimatedTime: '6 minutes',
    nodes: [
      {
        id: 'input-5',
        type: NodeType.DATA_INPUT,
        position: { x: 100, y: 500 },
        data: {
          label: 'Campaign Goals',
          status: NodeStatus.IDLE,
          config: {
            inputType: 'textarea',
            placeholder: 'Describe your email campaign goals (e.g., "Promote new feature", "Increase engagement")',
            required: true
          }
        }
      },
      {
        id: 'llm-7',
        type: NodeType.LLM_TASK,
        position: { x: 300, y: 500 },
        data: {
          label: 'Generate Subject Lines',
          status: NodeStatus.IDLE,
          config: {
            prompt: 'Generate 5 compelling email subject lines for this campaign: {{goals}}. Make them engaging, clear, and optimized for open rates.',
            model: 'gpt-4',
            temperature: 0.7,
            maxTokens: 300
          }
        }
      },
      {
        id: 'llm-8',
        type: NodeType.LLM_TASK,
        position: { x: 500, y: 500 },
        data: {
          label: 'Create Email Content',
          status: NodeStatus.IDLE,
          config: {
            prompt: 'Create engaging email content for this campaign: {{goals}}. Include compelling copy, clear call-to-action, and professional tone.',
            model: 'gpt-4',
            temperature: 0.6,
            maxTokens: 800
          }
        }
      },
      {
        id: 'structured-5',
        type: NodeType.STRUCTURED_OUTPUT,
        position: { x: 700, y: 500 },
        data: {
          label: 'Campaign Package',
          status: NodeStatus.IDLE,
          config: {
            schema: '{"subject_lines": ["string"], "email_content": "string", "call_to_action": "string", "personalization_tips": ["string"], "send_time_recommendation": "string"}',
            model: 'gpt-3.5-turbo',
            temperature: 0.3
          }
        }
      },
      {
        id: 'output-5',
        type: NodeType.DATA_OUTPUT,
        position: { x: 900, y: 500 },
        data: {
          label: 'Email Campaign',
          status: NodeStatus.IDLE,
          config: {
            outputFormat: 'json',
            filename: 'email-campaign-{{timestamp}}.json',
            includeMetadata: true
          }
        }
      }
    ],
    edges: [
      { id: 'e1-2', source: 'input-5', target: 'llm-7' },
      { id: 'e2-3', source: 'llm-7', target: 'llm-8' },
      { id: 'e3-4', source: 'llm-8', target: 'structured-5' },
      { id: 'e4-5', source: 'structured-5', target: 'output-5' }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'lead-qualification',
    name: 'AI Lead Qualification',
    description: 'Automatically qualify leads and score them based on multiple criteria',
    category: 'Sales',
    difficulty: 'Intermediate',
    estimatedTime: '5 minutes',
    nodes: [
      {
        id: 'input-6',
        type: NodeType.DATA_INPUT,
        position: { x: 100, y: 600 },
        data: {
          label: 'Lead Information',
          status: NodeStatus.IDLE,
          config: {
            inputType: 'textarea',
            placeholder: 'Paste lead information (company, role, industry, etc.)',
            required: true
          }
        }
      },
      {
        id: 'web-scrape-3',
        type: NodeType.WEB_SCRAPING,
        position: { x: 300, y: 600 },
        data: {
          label: 'Company Research',
          status: NodeStatus.IDLE,
          config: {
            url: 'https://www.linkedin.com/company/{{company_name}}',
            maxLength: 800,
            includeImages: false
          }
        }
      },
      {
        id: 'llm-9',
        type: NodeType.LLM_TASK,
        position: { x: 500, y: 600 },
        data: {
          label: 'Qualify Lead',
          status: NodeStatus.IDLE,
          config: {
            prompt: 'Analyze this lead information and company data to determine qualification score. Consider: budget, authority, need, timeline (BANT criteria). Lead: {{lead_info}}, Company: {{company_data}}',
            model: 'gpt-4',
            temperature: 0.3,
            maxTokens: 600
          }
        }
      },
      {
        id: 'structured-6',
        type: NodeType.STRUCTURED_OUTPUT,
        position: { x: 700, y: 600 },
        data: {
          label: 'Lead Score',
          status: NodeStatus.IDLE,
          config: {
            schema: '{"qualification_score": "number", "bant_score": {"budget": "number", "authority": "number", "need": "number", "timeline": "number"}, "recommendations": ["string"], "next_steps": "string"}',
            model: 'gpt-3.5-turbo',
            temperature: 0.2
          }
        }
      },
      {
        id: 'output-6',
        type: NodeType.DATA_OUTPUT,
        position: { x: 900, y: 600 },
        data: {
          label: 'Qualification Report',
          status: NodeStatus.IDLE,
          config: {
            outputFormat: 'json',
            filename: 'lead-qualification-{{timestamp}}.json',
            includeMetadata: true
          }
        }
      }
    ],
    edges: [
      { id: 'e1-2', source: 'input-6', target: 'web-scrape-3' },
      { id: 'e2-3', source: 'web-scrape-3', target: 'llm-9' },
      { id: 'e3-4', source: 'llm-9', target: 'structured-6' },
      { id: 'e4-5', source: 'structured-6', target: 'output-6' }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const loadExampleWorkflow = (workflowId: string): Workflow | null => {
  return exampleWorkflows.find(w => w.id === workflowId) || null;
};