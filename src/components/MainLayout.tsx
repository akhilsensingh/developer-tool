import { useEffect, useState, useRef } from 'react';
import Split from 'react-split';
import { CodeEditor } from './CodeEditor';
import { ChatInterface } from './ChatInterface';
import { VisualFlow } from './VisualFlow';
import { LogsPanel } from './LogsPanel';
import { ModeToggle } from './ModeToggle';
import { SettingsDialog } from './SettingsDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/useAppStore';
import { Node } from '@xyflow/react';
import {
  Sparkles,
  Play,
  Save,
  Share,
  Settings,
  Pause,
  Bot
} from 'lucide-react';

export const MainLayout = () => {
  const {
    mode,
    setMode,
    code,
    setCode,
    language,
    nodes,
    setNodes,
    executeCode,
    isLogsOpen,
    setLogsOpen,
    isChatOpen,
    setChatOpen,
    codeStatus,
    setCodeStatus
  } = useAppStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const isRunning = codeStatus === 'executing';

  const handleNodeChange = (newNodes: Node[]) => { setNodes(newNodes) };

  const handleRun = async () => { await executeCode(); };

  const handleSave = () => { setCodeStatus('saved'); };

  const handleLogsToggle = () => { setLogsOpen(!isLogsOpen); };
  const handleChatToggle = () => { setChatOpen(!isChatOpen); };

  const handleSettingsOpen = () => { setIsSettingsOpen(true); };

  const handleHotkeys = () => {
    const handleHotkey = useAppStore((state) => state.handleHotkey);
    useEffect(() => {
      const listener = (event: KeyboardEvent) => {
        const combo = `${event.ctrlKey || event.metaKey ? 'ctrl+' : ''}${event.key.toLowerCase()}`;
        if (combo === 'ctrl+s' || combo === 'ctrl+r') {
          event.preventDefault();
          handleHotkey(combo);
        }
      };
      window.addEventListener('keydown', listener);
      return () => window.removeEventListener('keydown', listener);
    }, [handleHotkey]);
  };
  handleHotkeys();

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Top Header */}
      <header className="border-b border-border bg-card px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
                <img src="/Union.svg" alt="Logo" className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-sm font-semibold">Developer Studio</h1>
                <p className="text-xs text-muted-foreground">Phinite.AI</p>
              </div>
            </div>
            <div className="h-6 w-px bg-border" />
            <ModeToggle mode={mode} onModeChange={setMode} />
          </div>

          {/* Center Section */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Ready
            </Badge>
            {mode === 'code' && (
              <Badge variant="secondary" className="text-xs">
                {language.toUpperCase()}
              </Badge>
            )}
            {mode === 'visual' && (
              <Badge variant="secondary" className="text-xs">
                Nodes: {nodes.length}
              </Badge>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={`text-xs ${isRunning ? 'text-red-600' : ''}`}
              onClick={handleRun}
              disabled={isRunning}
            >
              {isRunning ? (
                <Pause className="h-3 w-3 mr-1 text-red-600" />
              ) : (
                <Play className="h-3 w-3 mr-1" />
              )}
              Run
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              disabled={codeStatus === 'saved'}
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="ghost" size="sm" className="text-xs">
              <Share className="h-3 w-3 mr-1" />
              Share
            </Button>
            <Button variant="ghost" size="sm" className="text-xs" onClick={handleSettingsOpen}>
              <Settings className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow overflow-auto h-full">
        {mode === 'code' ? (
          <div className="flex h-full min-h-0 overflow-hidden">
            {/* Code Editor Pane with LogsPanel below */}
            <div className="flex flex-col h-full min-h-0 overflow-hidden flex-1">
              <div className="flex-1 min-h-0 overflow-hidden">
                <CodeEditor
                  value={code}
                  onChange={setCode}
                  language={language}
                />
              </div>
              {isLogsOpen && (
                <div className="shrink-0">
                  <LogsPanel />
                </div>
              )}
            </div>

            {/* Chat Interface Pane */}
            {isChatOpen && (
              <div className="h-full">
                <ChatInterface currentMode={mode} />
              </div>
            )}
          </div>
        ) : (
          isChatOpen ? (
            <Split
              className="flex h-full"
              sizes={[70, 30]}
              minSize={[400, 300]}
              expandToMin={false}
              gutterSize={1}
              gutterAlign="center"
              snapOffset={30}
              dragInterval={1}
              direction="horizontal"
              cursor="col-resize"
            >
              {/* Visual Flow Pane */}
              <div className="h-full">
                <VisualFlow onNodeChange={handleNodeChange} />
              </div>
              {/* Chat Interface Pane */}
              <div className="h-full">
                <ChatInterface currentMode={mode} />
              </div>
            </Split>
          ) : (
            <div className="h-full">
              <VisualFlow onNodeChange={handleNodeChange} />
            </div>
          )
        )}
      </div>

             {/* Status Bar */}
       <footer className="border-t border-border bg-card px-4 py-1">
         <div className="flex items-center justify-between text-xs text-muted-foreground">
           <div className="flex items-center gap-4">
             <span>Status: Ready</span>
             <span>•</span>
             <span>AI: Connected</span>
             <span>•</span>
             <span>Mode: {mode === 'code' ? 'Code Editor' : 'Visual Flow'}</span>
           </div>
           <div className="flex items-center gap-4">
             <Button
               variant="ghost"
               size="sm"
               onClick={handleChatToggle}
               className={`text-xs px-0 py-1 h-6 hover:bg-transparent ${isChatOpen ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
               title="Toggle AI Chat"
             >
               <Bot className="h-3 w-3 mr-1" />
               AI Chat
             </Button>
             <span>•</span>
             <Button
               variant="ghost"
               size="sm"
               onClick={handleLogsToggle}
               className={`text-xs px-0 py-1 h-6 hover:bg-transparent ${isLogsOpen ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
               title="Toggle Logs Panel"
             >
               Logs
             </Button>
             <span>•</span>
             <span>Line 1, Col 1</span>
             <span>•</span>
             <span>UTF-8</span>
             <span>•</span>
             <span>Spaces: 2</span>
           </div>
         </div>
       </footer>

      {/* Settings Dialog */}
      <SettingsDialog 
        open={isSettingsOpen} 
        onOpenChange={setIsSettingsOpen} 
      />
    </div>
  );
};
