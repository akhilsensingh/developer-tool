import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAppStore } from '@/store/useAppStore';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Code, 
  Workflow, 
  Lightbulb,
  GripVertical,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  X
} from 'lucide-react';

interface ChatInterfaceProps {
  currentMode: 'code' | 'visual';
}

// Component to render text with code blocks and copy buttons
const TextWithCodeBlocks = ({ text }: { text: string }) => {
  const [copiedBlocks, setCopiedBlocks] = useState<Set<string>>(new Set());
  const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(new Set());

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedBlocks(prev => new Set(prev).add(code));
      setTimeout(() => {
        setCopiedBlocks(prev => {
          const newSet = new Set(prev);
          newSet.delete(code);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const toggleCodeBlock = (code: string) => {
    setExpandedBlocks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(code)) {
        newSet.delete(code);
      } else {
        newSet.add(code);
      }
      return newSet;
    });
  };

  // Split text by code blocks
  const parts = text.split(/(```[\s\S]*?```)/g);
  
  return (
    <div className="whitespace-pre-wrap">
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          // Extract language and code
          const lines = part.split('\n');
          const language = lines[0].replace('```', '').trim();
          const code = lines.slice(1, -1).join('\n');
          const isExpanded = expandedBlocks.has(code);
          
          return (
            <div key={index} className="my-3 relative">
              <div className="flex items-center justify-between bg-muted/50 px-3 py-2 rounded-t-lg border border-border">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleCodeBlock(code)}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                    <span className="font-mono">{language || 'code'}</span>
                    <span className="text-xs opacity-70">
                      ({code.split('\n').length} lines)
                    </span>
                  </button>
                </div>
                <button
                  onClick={() => copyToClipboard(code)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copiedBlocks.has(code) ? (
                    <>
                      <Check className="h-3 w-3" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              {isExpanded && (
                <pre className="bg-muted p-3 rounded-b-lg border border-border border-t-0 overflow-x-auto">
                  <code className="text-sm font-mono">{code}</code>
                </pre>
              )}
            </div>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </div>
  );
};

// Fixed streaming text component for AI responses
const StreamingText = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset when text changes
    setDisplayedText('');
    setCurrentIndex(0);
    setIsComplete(false);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length && !isComplete) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 30); // Adjust speed here

      return () => clearTimeout(timer);
    } else if (currentIndex >= text.length && !isComplete) {
      setIsComplete(true);
      onComplete?.();
    }
  }, [currentIndex, text, isComplete, onComplete]);

  // Auto-scroll when text is being streamed
  useEffect(() => {
    if (!isComplete && displayedText.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [displayedText, isComplete]);

  return (
    <div>
      <TextWithCodeBlocks text={displayedText} />
      {!isComplete && (
        <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse" style={{ animationDuration: '1s' }} />
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

// Simple message component without excessive animations
const MessageBubble = ({ 
  message, 
  isStreaming, 
  onStreamingComplete 
}: { 
  message: any; 
  isStreaming: boolean; 
  onStreamingComplete: () => void;
}) => {
  const isUser = message.type === 'user';
  
  const getContextIcon = (context?: string) => {
    switch (context) {
      case 'code':
        return <Code className="h-3 w-3" />;
      case 'visual':
        return <Workflow className="h-3 w-3" />;
      default:
        return <Lightbulb className="h-3 w-3" />;
    }
  };
  
  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`max-w-[80%] space-y-1 ${
        isUser ? 'flex flex-col items-end' : ''
      }`}>
        <div className={`p-3 rounded-lg text-sm ${
          isUser 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted border border-border'
        }`}>
          {!isUser && isStreaming ? (
            <StreamingText 
              text={message.content} 
              onComplete={onStreamingComplete}
            />
                     ) : (
             <TextWithCodeBlocks text={message.content} />
           )}
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>
            {message.timestamp instanceof Date 
              ? message.timestamp.toLocaleTimeString()
              : new Date(message.timestamp).toLocaleTimeString()
            }
          </span>
          {message.context && (
            <Badge variant="secondary" className="text-xs">
              {getContextIcon(message.context)}
              <span className="ml-1">{message.context}</span>
            </Badge>
          )}
        </div>
      </div>

      {isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-secondary text-secondary-foreground">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

// Simple typing indicator
const TypingIndicator = () => {
  return (
    <div className="flex gap-3 justify-start">
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-primary text-primary-foreground">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="bg-muted border border-border p-3 rounded-lg">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          AI is thinking...
        </div>
      </div>
    </div>
  );
};

export const ChatInterface = ({ currentMode }: ChatInterfaceProps) => {
  const { messages, addMessage, setCode, mode, chatPanelWidth, setChatPanelWidth, setChatOpen } = useAppStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageIdRef = useRef<string | null>(null);

  // Resizing logic
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isResizing) return;
    const handleMouseMove = (e: MouseEvent) => {
      const container = resizeRef.current?.parentElement;
      if (!container) return;
      const containerRect = container.getBoundingClientRect();
      const minWidth = 240;
      const maxWidth = Math.min(window.innerWidth * 0.3, 600);
      const newWidth = containerRect.right - e.clientX;
      const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
      setChatPanelWidth(clampedWidth);
    };
    const handleMouseUp = () => setIsResizing(false);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, setChatPanelWidth]);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);



  const generateCodeFromPrompt = (prompt: string) => {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('python') || lowerPrompt.includes('py')) {
      return `# Python code generated based on your request
import requests
import json
from typing import Dict, List, Optional

def process_data(data: List[Dict]) -> Dict:
    """
    Process a list of data items and return aggregated results.
    
    Args:
        data: List of dictionaries containing data
        
    Returns:
        Dictionary with processed results
    """
    if not data:
        return {"error": "No data provided"}
    
    try:
        # Process the data
        total_items = len(data)
        processed_data = {
            "total_items": total_items,
            "processed": True,
            "timestamp": "2024-01-01T00:00:00Z"
        }
        
        return processed_data
    except Exception as e:
        return {"error": f"Processing failed: {str(e)}"}

# Example usage
sample_data = [{"id": 1, "name": "Item 1"}, {"id": 2, "name": "Item 2"}]
result = process_data(sample_data)
print("Result:", result)`;
    }
    
    if (lowerPrompt.includes('react component')) {
      return `import React from 'react';

const MyComponent = () => {
  return (
    <div className="p-4 bg-card rounded-lg border">
      <h2 className="text-lg font-semibold mb-2">New Component</h2>
      <p className="text-muted-foreground">
        This component was generated by AI based on your request.
      </p>
    </div>
  );
};

export default MyComponent;`;
    }
    
    if (lowerPrompt.includes('function') || lowerPrompt.includes('calculate')) {
      return `// Generated function based on your request
function calculate(a, b) {
  // Add your logic here
  return a + b;
}

// Example usage
const result = calculate(5, 3);
console.log('Result:', result);`;
    }
    
    if (lowerPrompt.includes('api') || lowerPrompt.includes('fetch')) {
      return `// API call function
async function fetchData(url) {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

// Example usage
fetchData('/api/users')
  .then(data => console.log('Users:', data))
  .catch(error => console.error('Failed to fetch users:', error));`;
    }
    
    return `// Generated code based on your request: "${prompt}"
console.log('Hello from AI-generated code!');

// TODO: Implement your specific requirements here
function yourFunction() {
  // Add your logic based on the prompt
  return 'AI is ready to help you code!';
}

yourFunction();`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    addMessage({
      type: 'user',
      content: input,
      context: currentMode === 'code' ? 'code' : 'visual'
    });

    const currentInput = input;
    setInput('');
    setIsTyping(true);

    // Always generate code when in code mode
    const isCodeRequest = currentMode === 'code';
    console.log('Code request check:', { currentMode, isCodeRequest, currentInput });

    // Generate AI response
    let aiResponse = getAIResponse(currentInput, currentMode);
    
    // If it's a code request, generate and update code
    if (isCodeRequest) {
      console.log('Generating code for input:', currentInput);
      const generatedCode = generateCodeFromPrompt(currentInput);
      console.log('Generated code:', generatedCode);
      console.log('Setting code in store...');
      setCode(generatedCode);
      aiResponse = `I've generated code based on your request and updated the editor. The code includes:\n\n${currentInput}\n\nYou can now run or modify it as needed!`;
    } else {
      console.log('Not generating code - isCodeRequest is false');
    }

    // Add AI message with streaming
    setTimeout(() => {
      const messageId = Date.now().toString();
      lastMessageIdRef.current = messageId;
      
      addMessage({
        type: 'ai',
        content: aiResponse,
        context: currentMode === 'code' ? 'code' : 'visual'
      }, messageId);

      setStreamingMessageId(messageId);
      setIsTyping(false);
    }, 500);
  };

  const getAIResponse = (userInput: string, mode: 'code' | 'visual'): string => {
    if (mode === 'code') {
      return `I understand you want to work with code. Based on your request "${userInput}", I can help you create, modify, or debug code. Let me generate some suggestions for you.

Here's a sample Python function that demonstrates some common patterns:

\`\`\`python
def process_data(data_list):
    """
    Process a list of data items and return statistics.
    
    Args:
        data_list (list): List of numeric values
        
    Returns:
        dict: Dictionary containing min, max, average, and sum
    """
    if not data_list:
        return {"error": "Empty list provided"}
    
    try:
        # Calculate statistics
        min_val = min(data_list)
        max_val = max(data_list)
        avg_val = sum(data_list) / len(data_list)
        total_sum = sum(data_list)
        
        return {
            "min": min_val,
            "max": max_val,
            "average": round(avg_val, 2),
            "sum": total_sum,
            "count": len(data_list)
        }
    except Exception as e:
        return {"error": f"Processing failed: {str(e)}"}

# Example usage
sample_data = [10, 20, 30, 40, 50]
result = process_data(sample_data)
print("Statistics:", result)
\`\`\`

This function shows error handling, documentation, and data processing patterns. You can modify it based on your specific needs!`;
    } else {
      return `I see you're working in visual mode. For "${userInput}", I can help you create flow diagrams, add nodes, or modify the visual structure of your project.

Here's a sample Python script for creating a simple data visualization:

\`\`\`python
import matplotlib.pyplot as plt
import numpy as np

def create_simple_chart():
    """Create a simple bar chart using matplotlib."""
    
    # Sample data
    categories = ['A', 'B', 'C', 'D', 'E']
    values = [23, 45, 56, 78, 32]
    
    # Create the chart
    plt.figure(figsize=(10, 6))
    plt.bar(categories, values, color='skyblue', edgecolor='navy')
    
    # Customize the chart
    plt.title('Sample Data Visualization', fontsize=16, fontweight='bold')
    plt.xlabel('Categories', fontsize=12)
    plt.ylabel('Values', fontsize=12)
    plt.grid(axis='y', alpha=0.3)
    
    # Add value labels on bars
    for i, v in enumerate(values):
        plt.text(i, v + 1, str(v), ha='center', va='bottom')
    
    plt.tight_layout()
    plt.show()

# Run the visualization
create_simple_chart()
\`\`\`

This script demonstrates basic data visualization with matplotlib. You can adapt it for your visual workflow needs!`;
    }
  };

  const getContextIcon = (context?: string) => {
    switch (context) {
      case 'code':
        return <Code className="h-3 w-3" />;
      case 'visual':
        return <Workflow className="h-3 w-3" />;
      default:
        return <Lightbulb className="h-3 w-3" />;
    }
  };

  const getContextColor = (context?: string) => {
    switch (context) {
      case 'code':
        return 'text-primary';
      case 'visual':
        return 'text-accent';
      default:
        return 'text-muted-foreground';
    }
  };

  const handleStreamingComplete = () => {
    setStreamingMessageId(null);
  };

  // Chat suggestion handlers
  const handleSuggestionClick = (suggestion: string, type: 'editor' | 'chat' | 'both') => {
    setInput(suggestion);
    
    // Auto-send the suggestion
    setTimeout(() => {
      const currentInput = suggestion;
      
      // Add user message
      addMessage({
        type: 'user',
        content: currentInput,
        context: currentMode === 'code' ? 'code' : 'visual'
      });

      setIsTyping(true);

      // Generate AI response based on type
      let aiResponse = '';
      let generatedCode = '';

      if (type === 'editor' || type === 'both') {
        // Generate code for editor
        generatedCode = generateCodeFromPrompt(suggestion);
        setCode(generatedCode);
        aiResponse = `I've generated code based on your request and updated the editor. The code includes:\n\n${suggestion}\n\nYou can now run or modify it as needed!`;
      } else if (type === 'chat') {
        // Generate code for chat only
        aiResponse = getAIResponse(suggestion, currentMode);
      }

      // Add AI message with streaming
      setTimeout(() => {
        const messageId = Date.now().toString();
        lastMessageIdRef.current = messageId;
        
        addMessage({
          type: 'ai',
          content: aiResponse,
          context: currentMode === 'code' ? 'code' : 'visual'
        }, messageId);

        setStreamingMessageId(messageId);
        setIsTyping(false);
      }, 500);
    }, 100);
  };

  return (
    <div 
      className="h-full flex flex-col bg-card relative"
      style={{ 
        width: chatPanelWidth, 
        minWidth: 240, 
        maxWidth: Math.min(window.innerWidth * 0.3, 600) 
      }}
    >
      {/* Resize Handle (left edge) */}
      <div
        ref={resizeRef}
        className="absolute left-0 top-0 h-full w-2 flex items-center justify-center cursor-ew-resize select-none group z-20 bg-transparent"
        onMouseDown={handleResizeStart}
        style={{ minWidth: 8, maxWidth: 16 }}
        title="Resize chat panel"
      >
        <div className="w-1 h-8 bg-transparent rounded-full group-hover: transition-colors absolute left-1/2 -translate-x-1/2" />
        <GripVertical className="h-2 w-2 text-muted-foreground relative z-10" />
      </div>
      
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-3">
          <MessageCircle className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">AI Assistant</span>
          <Badge variant="outline" className="text-xs">
            {getContextIcon(currentMode)}
            <span className="ml-1">{currentMode}</span>
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setChatOpen(false)}
          className="h-6 w-6 p-0 hover:bg-muted"
          title="Close Chat"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Bot className="h-8 w-8 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">
                    Hello! I'm your AI coding assistant.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Ask me to write code, create components, or help with your project.
                  </p>
                </div>
                
                                 {/* Chat Suggestions */}
                 <div className="space-y-2">
                   <p className="text-xs text-muted-foreground font-medium">Quick Start:</p>
                   <div className="flex flex-col gap-2">
                     <Button
                       variant="outline"
                       size="sm"
                       onClick={() => handleSuggestionClick('Create a data processing pipeline for CSV files', 'editor')}
                       className="text-xs h-8 justify-start"
                     >
                       Generate code in editor
                     </Button>
                     <Button
                       variant="outline"
                       size="sm"
                       onClick={() => handleSuggestionClick('Show me different sorting algorithms', 'chat')}
                       className="text-xs h-8 justify-start"
                     >
                       Generate code in chat
                     </Button>
                     <Button
                       variant="outline"
                       size="sm"
                       onClick={() => handleSuggestionClick('Build a REST API with authentication', 'both')}
                       className="text-xs h-8 justify-start"
                     >
                       Generate code in both
                     </Button>
                   </div>
                 </div>
              </div>
            </div>
          ) : (
            <div>
              {messages.map((message, index) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isStreaming={streamingMessageId === message.id}
                  onStreamingComplete={handleStreamingComplete}
                />
              ))}
            </div>
          )}
          
          {isTyping && <TypingIndicator />}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Chat Suggestions - Only when chat is empty */}
      {messages.length === 0 && (
        <div className="px-3 py-2 border-t border-border">
          <p className="text-xs text-muted-foreground font-medium mb-2">Try these examples to get started:</p>
          <div className="flex gap-2 overflow-x-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSuggestionClick('Write documentation for this code', 'chat')}
              className="text-xs h-8 whitespace-nowrap flex-shrink-0"
            >
              Write documentation
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSuggestionClick('Optimize performance of this function', 'editor')}
              className="text-xs h-8 whitespace-nowrap flex-shrink-0"
            >
              Optimize performance
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSuggestionClick('Find and fix bugs in this code', 'both')}
              className="text-xs h-8 whitespace-nowrap flex-shrink-0"
            >
              Find and fix bugs
            </Button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask me to ${currentMode === 'code' ? 'write code, create functions...' : 'build visual flows, add nodes...'}`}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1"
          />
          <Button 
            onClick={handleSend} 
            disabled={!input.trim() || isTyping}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};