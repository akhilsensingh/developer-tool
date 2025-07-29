import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Node, Edge } from '@xyflow/react';

export type CodeStatus = 'draft' | 'saved' | 'executing' | 'error';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  context?: 'code' | 'visual' | 'general';
}

interface LogEntry {
  id: string;
  type: 'info' | 'error' | 'warning' | 'success';
  message: string;
  timestamp: Date;
}

interface AppState {
  // Mode and UI state
  mode: 'code' | 'visual';
  isLogsOpen: boolean;

  // Code editor state
  code: string;
  language: string;
  codeStatus: CodeStatus;
  handleHotkey: (combo: string) => void;


  // Visual flow state
  nodes: Node[];
  edges: Edge[];

  // Chat state
  messages: Message[];

  // Logs state
  logs: LogEntry[];

  // Actions
  setMode: (mode: 'code' | 'visual') => void;
  setCode: (code: string) => void;
  setLanguage: (language: string) => void;
  setCodeStatus: (status: CodeStatus) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  addLog: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
  setLogsOpen: (open: boolean) => void;
  executeCode: () => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      mode: 'code',
      isLogsOpen: false,
      code: `// Welcome to your AI-powered code editor!
// Switch between Code and Visual modes to build amazing applications

function greetUser(name) {
  console.log(\`Hello, \${name}! Welcome to the future of coding.\`);
  
  // AI can help you write better code
  const skills = ['JavaScript', 'React', 'AI Integration'];
  
  return {
    message: \`Ready to build something amazing?\`,
    skills,
    ready: true
  };
}

// Try asking the AI assistant for help!
const user = greetUser('Developer');
console.log(user);`,
      language: 'javascript',
      codeStatus: 'draft',
      nodes: [],
      edges: [],
      messages: [],
      logs: [],

      // Actions
      handleHotkey: (combo: string) => {
        const { executeCode, setCodeStatus, codeStatus } = get();

        if (combo === 'ctrl+s') {
          if (codeStatus !== 'saved') {
            setCodeStatus('saved');
          }
        }

        if (combo === 'ctrl+r') {
          executeCode();
        }
      },

      setMode: (mode) => set({ mode }),

      setCode: (code) => set({
        code,
        codeStatus: 'draft'
      }),

      setLanguage: (language) => set({ language }),

      setCodeStatus: (codeStatus) => set({ codeStatus }),

      setNodes: (nodes) => set({ nodes }),

      setEdges: (edges) => set({ edges }),

      addMessage: (message) => set((state) => ({
        messages: [...state.messages, {
          ...message,
          id: Date.now().toString(),
          timestamp: new Date()
        }]
      })),

      addLog: (log) => set((state) => ({
        logs: [...state.logs, {
          ...log,
          id: Date.now().toString(),
          timestamp: new Date()
        }]
      })),

      clearLogs: () => set({ logs: [] }),

      setLogsOpen: (isLogsOpen) => set({ isLogsOpen }),

      executeCode: async () => {
        const { code, addLog, setCodeStatus, setLogsOpen } = get();

        setCodeStatus('executing');
        setLogsOpen(true);
        addLog({ type: 'info', message: 'Starting code execution...' });

        try {
          // Simulate code execution
          await new Promise(resolve => setTimeout(resolve, 2000));

          // Mock successful execution
          addLog({ type: 'success', message: 'Code executed successfully!' });
          addLog({ type: 'info', message: `Output: ${code.split('\n').length} lines processed` });

          setCodeStatus('saved');
        } catch (error) {
          addLog({ type: 'error', message: `Execution failed: ${error}` });
          setCodeStatus('error');
        }
      }
    }),
    {
      name: 'ai-code-studio',
      partialize: (state) => ({
        mode: state.mode,
        code: state.code,
        language: state.language,
        nodes: state.nodes,
        edges: state.edges,
        messages: state.messages
      })
    }
  )
);