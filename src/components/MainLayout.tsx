import { useState } from 'react';
import Split from 'react-split';
import { CodeEditor } from './CodeEditor';
import { ChatInterface } from './ChatInterface';
import { VisualFlow } from './VisualFlow';
import { LogsPanel } from './LogsPanel';
import { ModeToggle } from './ModeToggle';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/useAppStore';
import { Node } from '@xyflow/react';
import {
  Terminal,
  Sparkles,
  Play,
  Save,
  Share,
  Settings,
  Menu,
  Maximize2,
  Pause
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
    codeStatus,
    setCodeStatus
  } = useAppStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isRunning = codeStatus === 'executing';

  const handleNodeChange = (newNodes: Node[]) => { setNodes(newNodes) };

  const handleRun = async () => {
    await executeCode();
  };

  const handleSave = () => {
    setCodeStatus('saved');
  };

  return (
    <div className="h-screen bg-background flex flex-col h-screen">
      {/* Top Header */}
      <header className="border-b border-border bg-card px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Terminal className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-semibold">AI Code Studio</h1>
                <p className="text-xs text-muted-foreground">Custom Cursor.ai</p>
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
            <Button variant="ghost" size="sm" className="text-xs">
              <Settings className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="text-xs"
            >
              <Maximize2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow overflow-auto h-full">
        {mode === 'code' ? (
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
            {/* Code Editor Pane */}
            <div className="h-full">
              <CodeEditor
                value={code}
                onChange={setCode}
                language={language}
              />
            </div>

            {/* Chat Interface Pane */}
            <div className="h-full">
              <ChatInterface currentMode={mode} />
            </div>
          </Split>
        ) : (
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
        )}
      </div>

      {/* Logs Panel */}
      {isLogsOpen && <LogsPanel />}

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
            <span>Line 1, Col 1</span>
            <span>•</span>
            <span>UTF-8</span>
            <span>•</span>
            <span>Spaces: 2</span>
          </div>
        </div>
      </footer>
    </div>
  );
};