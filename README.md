# Agent Workflow Builder

A visual, diagram-based AI workflow builder built with React Flow, inspired by OpenAI's Agent Builder and similar tools like [Sim.ai](https://www.sim.ai/). This open-source alternative allows developers to create, connect, and configure AI-powered workflows through an intuitive visual interface.

## Features

### Visual Workflow Editor
- **Drag-and-drop interface** powered by [React Flow](https://reactflow.dev/)
- **Real-time node connection** with visual feedback
- **Intuitive canvas** for building complex AI workflows
- **Responsive design** with modern UI components

### AI Node Types
- **Web Scraping**: Extract and summarize content from websites
- **Structured Output Extractor**: Parse data using JSON schemas with LLM
- **Embedding Generator**: Create vector representations for text/data
- **Similarity Search**: Query vector stores for semantically similar content
- **LLM Task Node**: General-purpose text generation and reasoning
- **Data Input/Output**: Workflow entry and exit points

### Configuration & Execution
- **Configurable parameters** per node (model selection, temperature, etc.)
- **Real-time execution** with step-by-step processing
- **Visual status indicators** (idle, running, success, error)
- **Execution logs** and debugging information
- **Export/Import workflows** as JSON

### Developer Experience
- **TypeScript support** for type safety
- **Modular architecture** for easy extension
- **Mock execution engine** for testing
- **Comprehensive error handling**

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd AgentWorkflowbuilder
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Building Workflows

1. **Add Nodes**: Click on nodes in the left palette to add them to the canvas
2. **Connect Nodes**: Drag from one node's output handle to another's input handle
3. **Configure Nodes**: Double-click nodes to open configuration panels
4. **Run Workflows**: Click "Run Workflow" to execute the entire workflow
5. **Export Results**: Save workflow configurations and execution results

### Node Configuration

Each node type has specific configuration options:

- **Web Scraping**: URL, max summary length, include images
- **Structured Output**: JSON schema, model selection, temperature
- **Embedding Generator**: Model, dimensions, normalization
- **Similarity Search**: Vector store ID, top-k results, similarity threshold
- **LLM Task**: System prompt, model, temperature, max tokens
- **Data Input/Output**: Input type, output format, metadata inclusion

## Architecture

### Core Components

- **WorkflowBuilder**: Main application component
- **CustomNode**: React Flow node component with status indicators
- **NodeConfigPanel**: Configuration interface for node parameters
- **NodePalette**: Sidebar for adding new nodes
- **ExecutionPanel**: Bottom panel for running workflows and viewing results
- **WorkflowExecutor**: Service for executing workflows step-by-step

### Key Services

- **WorkflowExecutor**: Handles workflow execution with mock AI services
- **Node Configurations**: Defines parameters and validation for each node type
- **Type Definitions**: Comprehensive TypeScript interfaces

## Technology Stack

- **React 18** with TypeScript
- **React Flow** for the visual workflow editor
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for build tooling

## Inspiration

This project draws inspiration from:
- [OpenAI Agent Builder](https://platform.openai.com/docs/guides/agents/agent-builder) - Official OpenAI workflow builder
- [Sim.ai](https://www.sim.ai/) - Open-source AI workflow platform
- [React Flow](https://reactflow.dev/) - The underlying visual editor library

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## Roadmap

- [ ] Real OpenAI API integration
- [ ] Vector database integration (Pinecone, Weaviate)
- [ ] Web scraping service integration
- [ ] Workflow templates and examples
- [ ] Collaborative editing
- [ ] Version control for workflows
- [ ] Advanced debugging tools
- [ ] Performance optimization

## License

MIT License - see LICENSE file for details

## Acknowledgments

- [React Flow](https://reactflow.dev/) team for the excellent visual editor library
- [OpenAI](https://openai.com/) for inspiration and API design
- [Sim.ai](https://www.sim.ai/) team for the open-source workflow builder concept

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd AgentWorkflowbuilder
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Building Workflows

1. **Add Nodes**: Click on nodes in the left palette to add them to the canvas
2. **Connect Nodes**: Drag from one node's output handle to another's input handle
3. **Configure Nodes**: Double-click nodes to open configuration panels
4. **Run Workflows**: Click "Run Workflow" to execute the entire workflow
5. **Export Results**: Save workflow configurations and execution results

### Node Configuration

Each node type has specific configuration options:

- **Web Scraping**: URL, max summary length, include images
- **Structured Output**: JSON schema, model selection, temperature
- **Embedding Generator**: Model, dimensions, normalization
- **Similarity Search**: Vector store ID, top-k results, similarity threshold
- **LLM Task**: System prompt, model, temperature, max tokens
- **Data Input/Output**: Input type, output format, metadata inclusion

## Architecture

### Core Components

- **WorkflowBuilder**: Main application component
- **CustomNode**: React Flow node component with status indicators
- **NodeConfigPanel**: Configuration interface for node parameters
- **NodePalette**: Sidebar for adding new nodes
- **ExecutionPanel**: Bottom panel for running workflows and viewing results
- **WorkflowExecutor**: Service for executing workflows step-by-step

### Key Services

- **WorkflowExecutor**: Handles workflow execution with mock AI services
- **Node Configurations**: Defines parameters and validation for each node type
- **Type Definitions**: Comprehensive TypeScript interfaces

## Technology Stack

- **React 18** with TypeScript
- **React Flow** for the visual workflow editor
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for build tooling

## Inspiration

This project draws inspiration from:
- [OpenAI Agent Builder](https://platform.openai.com/docs/guides/agents/agent-builder) - Official OpenAI workflow builder
- [Sim.ai](https://www.sim.ai/) - Open-source AI workflow platform
- [React Flow](https://reactflow.dev/) - The underlying visual editor library

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## Roadmap

- [ ] Real OpenAI API integration
- [ ] Vector database integration (Pinecone, Weaviate)
- [ ] Web scraping service integration
- [ ] Workflow templates and examples
- [ ] Collaborative editing
- [ ] Version control for workflows
- [ ] Advanced debugging tools
- [ ] Performance optimization

## License

MIT License - see LICENSE file for details

## Acknowledgments

- [React Flow](https://reactflow.dev/) team for the excellent visual editor library
- [OpenAI](https://openai.com/) for inspiration and API design
- [Sim.ai](https://www.sim.ai/) team for the open-source workflow builder concept
