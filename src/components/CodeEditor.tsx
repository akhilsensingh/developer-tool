import Editor from '@monaco-editor/react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Play, Save, Settings, Circle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
}

export const CodeEditor = ({ value, onChange, language }: CodeEditorProps) => {
  const { codeStatus, setCodeStatus, executeCode, setLogsOpen } = useAppStore();
  
  const isRunning = codeStatus === 'executing';

  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '');
  };

  const handleRun = async () => {
    await executeCode();
  };

  const handleSave = () => {
    setCodeStatus('saved');
  };

  const getStatusColor = () => {
    switch (codeStatus) {
      case 'draft':
        return 'text-warning';
      case 'saved':
        return 'text-success';
      case 'executing':
        return 'text-primary';
      case 'error':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusText = () => {
    switch (codeStatus) {
      case 'draft':
        return 'Draft';
      case 'saved':
        return 'Saved';
      case 'executing':
        return 'Running...';
      case 'error':
        return 'Error';
      default:
        return 'Ready';
    }
  };

  return (
    <div className="h-full flex flex-col bg-editor-background">
      {/* Editor Header */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">main.{language}</span>
          <Badge variant="secondary" className="text-xs">
            {language.toUpperCase()}
          </Badge>
          <div className="flex items-center gap-1">
            <Circle className={`h-2 w-2 fill-current ${getStatusColor()}`} />
            <span className={`text-xs ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRun}
            disabled={isRunning}
            className="text-primary hover:text-primary-glow"
          >
            <Play className="h-4 w-4 mr-2" />
            {isRunning ? 'Running...' : 'Run'}
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
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 monaco-editor-container">
        <Editor
          height="100%"
          language={language}
          value={value}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            fontSize: 14,
            fontFamily: 'JetBrains Mono, Fira Code, Cascadia Code, SF Mono, Consolas, monospace',
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            minimap: { enabled: true },
            wordWrap: 'on',
            tabSize: 2,
            insertSpaces: true,
            renderLineHighlight: 'line',
            selectionHighlight: false,
            bracketPairColorization: { enabled: true },
            
            // Enhanced IntelliSense and suggestions
            suggestOnTriggerCharacters: true,
            quickSuggestions: {
              other: true,
              comments: true,
              strings: true,
            },
            quickSuggestionsDelay: 100,
            acceptSuggestionOnCommitCharacter: true,
            acceptSuggestionOnEnter: 'on',
            suggest: {
              filterGraceful: true,
              insertMode: 'insert',
              localityBonus: true,
              shareSuggestSelections: false,
              showIcons: true,
              showStatusBar: true,
              snippetsPreventQuickSuggestions: false,
            },
            
            // Enhanced editing features
            autoIndent: 'full',
            formatOnPaste: true,
            formatOnType: true,
            folding: true,
            foldingStrategy: 'auto',
            foldingHighlight: true,
            
            // Enhanced hover and lightbulb
            hover: {
              enabled: true,
              delay: 300,
              sticky: true,
            },
            lightbulb: { enabled: true },
            
            // Parameter hints
            parameterHints: {
              enabled: true,
              cycle: true,
            },
            
            // Enhanced cursor and selection
            cursorBlinking: 'blink',
            cursorSmoothCaretAnimation: 'on',
            cursorWidth: 2,
            matchBrackets: 'always',
            multiCursorMergeOverlapping: true,
            multiCursorModifier: 'alt',
            
            // Enhanced scrolling
            mouseWheelZoom: true,
            smoothScrolling: true,
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
              useShadows: true,
              handleMouseWheel: true,
              alwaysConsumeMouseWheel: true,
            },
            
            // Code analysis
            showUnused: true,
            renderValidationDecorations: 'editable',
            
            // Snippets
            snippetSuggestions: 'top',
            
            // Context menu and drag & drop
            contextmenu: true,
            dragAndDrop: true,
            
            // Find widget
            find: {
              cursorMoveOnFindWidget: true,
              seedSearchStringFromSelection: 'always',
              autoFindInSelection: 'never',
            },
          }}
        />
      </div>
    </div>
  );
};