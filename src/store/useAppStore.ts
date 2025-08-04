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
  isChatOpen: boolean;
  logsPanelHeight: number;
  chatPanelWidth: number;

  // Code editor state
  code: string;
  language: string;
  codeStatus: CodeStatus;
  fontSize: number;
  tabSize: number;
  showLineNumbers: boolean;
  showMinimap: boolean;
  wordWrap: boolean;
  codeCompletion: boolean;
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
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>, customId?: string) => void;
  addLog: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
  setLogsOpen: (open: boolean) => void;
  setChatOpen: (open: boolean) => void;
  setLogsPanelHeight: (height: number) => void;
  setChatPanelWidth: (width: number) => void;
  setFontSize: (size: number) => void;
  setTabSize: (size: number) => void;
  setShowLineNumbers: (show: boolean) => void;
  setShowMinimap: (show: boolean) => void;
  setWordWrap: (wrap: boolean) => void;
  setCodeCompletion: (enable: boolean) => void;
  executeCode: () => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      mode: 'code',
      isLogsOpen: false,
      isChatOpen: true,
      logsPanelHeight: 192, // Default height (h-48 = 192px)
      chatPanelWidth: 320, // Default width in px
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
      fontSize: 14,
      tabSize: 2,
      showLineNumbers: true,
      showMinimap: false,
      wordWrap: true,
      codeCompletion: true,
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

      addMessage: (message, customId?: string) => set((state) => ({
        messages: [...state.messages, {
          ...message,
          id: customId || Date.now().toString(),
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

      setChatOpen: (isChatOpen) => set({ isChatOpen }),

      setLogsPanelHeight: (logsPanelHeight) => set({ logsPanelHeight }),
      setChatPanelWidth: (chatPanelWidth) => set({ chatPanelWidth }),
      setFontSize: (fontSize) => set({ fontSize }),
      setTabSize: (tabSize) => set({ tabSize }),
      setShowLineNumbers: (showLineNumbers) => set({ showLineNumbers }),
      setShowMinimap: (showMinimap) => set({ showMinimap }),
      setWordWrap: (wordWrap) => set({ wordWrap }),
      setCodeCompletion: (codeCompletion) => set({ codeCompletion }),

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
        messages: state.messages,
        logsPanelHeight: state.logsPanelHeight,
        chatPanelWidth: state.chatPanelWidth,
        fontSize: state.fontSize,
        tabSize: state.tabSize,
        showLineNumbers: state.showLineNumbers,
        showMinimap: state.showMinimap,
        wordWrap: state.wordWrap,
        codeCompletion: state.codeCompletion,
        isChatOpen: state.isChatOpen
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convert timestamp strings back to Date objects
          state.messages = state.messages.map(message => ({
            ...message,
            timestamp: new Date(message.timestamp)
          }));
          state.logs = state.logs.map(log => ({
            ...log,
            timestamp: new Date(log.timestamp)
          }));
        }
      }
    }
  )
);