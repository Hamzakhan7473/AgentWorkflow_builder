import React from 'react';
import { NodeType, ExecutionResult } from '../types';
import { 
  Globe, 
  FileText, 
  Hash, 
  Search, 
  Bot, 
  Download, 
  Upload,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink,
  Copy,
  Eye
} from 'lucide-react';

interface ResultDisplayProps {
  result: ExecutionResult;
  nodeType: NodeType;
  nodeLabel: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, nodeType, nodeLabel }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const renderWebScrapingResult = () => {
    const data = result.outputData;
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <Globe className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="font-semibold text-blue-900">Website Scraped Successfully</h3>
            <p className="text-sm text-blue-700">{data?.url}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white border border-gray-200 rounded-xl">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Page Title
            </h4>
            <p className="text-gray-700">{data?.title}</p>
          </div>
          
          <div className="p-4 bg-white border border-gray-200 rounded-xl">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Scraped At
            </h4>
            <p className="text-gray-700">{formatTimestamp(data?.timestamp)}</p>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-xl">
          <h4 className="font-medium text-gray-900 mb-3">Content Summary</h4>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed">{data?.summary}</p>
          </div>
          <button
            onClick={() => copyToClipboard(data?.summary)}
            className="mt-3 px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded-md transition-colors flex items-center gap-1"
          >
            <Copy className="w-3 h-3" />
            Copy Summary
          </button>
        </div>
        
        {data?.url && (
          <div className="flex gap-2">
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Visit Website
            </a>
          </div>
        )}
      </div>
    );
  };

  const renderLLMTaskResult = () => {
    const data = result.outputData;
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border border-purple-200">
          <Bot className="w-6 h-6 text-purple-600" />
          <div>
            <h3 className="font-semibold text-purple-900">AI Response Generated</h3>
            <p className="text-sm text-purple-700">Model: {data?.model}</p>
          </div>
        </div>
        
        <div className="p-4 bg-white border border-gray-200 rounded-xl">
          <h4 className="font-medium text-gray-900 mb-3">AI Response</h4>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{data?.response}</p>
          </div>
          <button
            onClick={() => copyToClipboard(data?.response)}
            className="mt-3 px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded-md transition-colors flex items-center gap-1"
          >
            <Copy className="w-3 h-3" />
            Copy Response
          </button>
        </div>
        
        {data?.usage && (
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{data.usage.promptTokens}</div>
              <div className="text-xs text-gray-600">Prompt Tokens</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{data.usage.completionTokens}</div>
              <div className="text-xs text-gray-600">Completion Tokens</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{data.usage.totalTokens}</div>
              <div className="text-xs text-gray-600">Total Tokens</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderStructuredOutputResult = () => {
    const data = result.outputData;
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
          <FileText className="w-6 h-6 text-green-600" />
          <div>
            <h3 className="font-semibold text-green-900">Structured Data Extracted</h3>
            <p className="text-sm text-green-700">Schema-based parsing completed</p>
          </div>
        </div>
        
        <div className="p-4 bg-white border border-gray-200 rounded-xl">
          <h4 className="font-medium text-gray-900 mb-3">Extracted Data</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto">
              {JSON.stringify(data?.structured, null, 2)}
            </pre>
          </div>
          <button
            onClick={() => copyToClipboard(JSON.stringify(data?.structured, null, 2))}
            className="mt-3 px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded-md transition-colors flex items-center gap-1"
          >
            <Copy className="w-3 h-3" />
            Copy JSON
          </button>
        </div>
        
        {data?.structured?.metadata && (
          <div className="p-4 bg-blue-50 rounded-xl">
            <h4 className="font-medium text-blue-900 mb-2">Extraction Metadata</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700 font-medium">Confidence:</span>
                <span className="ml-2 text-blue-900">{(data.structured.metadata.confidence * 100).toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Timestamp:</span>
                <span className="ml-2 text-blue-900">{formatTimestamp(data.structured.metadata.timestamp)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderEmbeddingResult = () => {
    const data = result.outputData;
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-cyan-50 rounded-xl border border-cyan-200">
          <Hash className="w-6 h-6 text-cyan-600" />
          <div>
            <h3 className="font-semibold text-cyan-900">Vector Embedding Generated</h3>
            <p className="text-sm text-cyan-700">Model: {data?.model}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white border border-gray-200 rounded-xl">
            <h4 className="font-medium text-gray-900 mb-2">Input Text</h4>
            <p className="text-gray-700 text-sm">{data?.text}</p>
          </div>
          
          <div className="p-4 bg-white border border-gray-200 rounded-xl">
            <h4 className="font-medium text-gray-900 mb-2">Vector Details</h4>
            <div className="space-y-1 text-sm">
              <div><span className="text-gray-600">Dimensions:</span> <span className="font-medium">{data?.dimensions}</span></div>
              <div><span className="text-gray-600">Model:</span> <span className="font-medium">{data?.model}</span></div>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-xl">
          <h4 className="font-medium text-gray-900 mb-3">Vector Preview (First 10 dimensions)</h4>
          <div className="bg-white rounded-lg p-3 border">
            <code className="text-xs text-gray-700">
              [{data?.embedding?.slice(0, 10).map((val: number) => val.toFixed(4)).join(', ')}...]
            </code>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Showing first 10 of {data?.dimensions} dimensions
          </p>
        </div>
      </div>
    );
  };

  const renderSimilaritySearchResult = () => {
    const data = result.outputData;
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl border border-orange-200">
          <Search className="w-6 h-6 text-orange-600" />
          <div>
            <h3 className="font-semibold text-orange-900">Similarity Search Completed</h3>
            <p className="text-sm text-orange-700">Found {data?.results?.length} results</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {data?.results?.map((item: any, index: number) => (
            <div key={index} className="p-4 bg-white border border-gray-200 rounded-xl">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900">Result {index + 1}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Similarity:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    {(item.similarity * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              <p className="text-gray-700 text-sm mb-2">{item.content}</p>
              {item.metadata && (
                <div className="text-xs text-gray-500">
                  <span className="font-medium">Source:</span> {item.metadata.source}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="p-4 bg-gray-50 rounded-xl">
          <h4 className="font-medium text-gray-900 mb-2">Search Details</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Vector Store:</span>
              <span className="ml-2 font-medium">{data?.vectorStore}</span>
            </div>
            <div>
              <span className="text-gray-600">Top K:</span>
              <span className="ml-2 font-medium">{data?.topK}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDataInputResult = () => {
    const data = result.outputData;
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <Upload className="w-6 h-6 text-gray-600" />
          <div>
            <h3 className="font-semibold text-gray-900">Data Input Processed</h3>
            <p className="text-sm text-gray-700">Type: {data?.type}</p>
          </div>
        </div>
        
        <div className="p-4 bg-white border border-gray-200 rounded-xl">
          <h4 className="font-medium text-gray-900 mb-3">Input Data</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {typeof data?.data === 'string' ? data.data : JSON.stringify(data?.data, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  };

  const renderDataOutputResult = () => {
    const data = result.outputData;
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
          <Download className="w-6 h-6 text-green-600" />
          <div>
            <h3 className="font-semibold text-green-900">Data Export Ready</h3>
            <p className="text-sm text-green-700">Format: {data?.format}</p>
          </div>
        </div>
        
        <div className="p-4 bg-white border border-gray-200 rounded-xl">
          <h4 className="font-medium text-gray-900 mb-3">Exported Data</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {typeof data?.output === 'string' ? data.output : JSON.stringify(data?.output, null, 2)}
            </pre>
          </div>
          <button
            onClick={() => copyToClipboard(typeof data?.output === 'string' ? data.output : JSON.stringify(data?.output, null, 2))}
            className="mt-3 px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded-md transition-colors flex items-center gap-1"
          >
            <Copy className="w-3 h-3" />
            Copy Data
          </button>
        </div>
        
        <div className="p-4 bg-blue-50 rounded-xl">
          <h4 className="font-medium text-blue-900 mb-2">Export Details</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-blue-700">Filename:</span>
              <span className="ml-2 text-blue-900">{data?.filename}</span>
            </div>
            <div>
              <span className="text-blue-700">Format:</span>
              <span className="ml-2 text-blue-900">{data?.format}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderErrorResult = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
          <XCircle className="w-6 h-6 text-red-600" />
          <div>
            <h3 className="font-semibold text-red-900">Execution Failed</h3>
            <p className="text-sm text-red-700">{nodeLabel}</p>
          </div>
        </div>
        
        <div className="p-4 bg-white border border-red-200 rounded-xl">
          <h4 className="font-medium text-red-900 mb-3">Error Details</h4>
          <div className="bg-red-50 rounded-lg p-4">
            <p className="text-red-700 text-sm">{result.error}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderResult = () => {
    if (result.status === 'error') {
      return renderErrorResult();
    }

    switch (nodeType) {
      case NodeType.WEB_SCRAPING:
        return renderWebScrapingResult();
      case NodeType.LLM_TASK:
        return renderLLMTaskResult();
      case NodeType.STRUCTURED_OUTPUT:
        return renderStructuredOutputResult();
      case NodeType.EMBEDDING_GENERATOR:
        return renderEmbeddingResult();
      case NodeType.SIMILARITY_SEARCH:
        return renderSimilaritySearchResult();
      case NodeType.DATA_INPUT:
        return renderDataInputResult();
      case NodeType.DATA_OUTPUT:
        return renderDataOutputResult();
      default:
        return (
          <div className="p-4 bg-gray-50 rounded-xl">
            <pre className="text-sm text-gray-700">
              {JSON.stringify(result.outputData, null, 2)}
            </pre>
          </div>
        );
    }
  };

  return (
    <div className="result-display">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-2">
          {result.status === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : result.status === 'error' ? (
            <XCircle className="w-5 h-5 text-red-500" />
          ) : (
            <Clock className="w-5 h-5 text-gray-500" />
          )}
          <h3 className="font-semibold text-gray-900">{nodeLabel}</h3>
        </div>
        <div className="ml-auto text-sm text-gray-500">
          {result.executionTime}ms
        </div>
      </div>
      
      {renderResult()}
    </div>
  );
};

export default ResultDisplay;
