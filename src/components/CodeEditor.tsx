import Editor from '@monaco-editor/react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Play, Save, Settings, Circle, Bot } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
}

export const CodeEditor = ({ value, onChange, language }: CodeEditorProps) => {
  const { 
    code,
    setCode,
    codeStatus, 
    setCodeStatus, 
    executeCode, 
    setLogsOpen, 
    setChatOpen, 
    isChatOpen, 
    fontSize, 
    tabSize, 
    showLineNumbers,
    showMinimap,
    wordWrap,
    codeCompletion
  } = useAppStore();
  const editorRef = useRef<any>(null);
  const [isStatusGlowing, setIsStatusGlowing] = useState(false);
  const prevStatusRef = useRef(codeStatus);

  const handleEditorChange = (value: string | undefined) => {
    const newValue = value || '';
    console.log('CodeEditor: Code changed to:', newValue.substring(0, 100) + '...');
    setCode(newValue);
    onChange(newValue);
  };

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    console.log('Editor mounted with tabSize:', tabSize);
    
    // Set initial options on both editor and model
    editor.updateOptions({
      tabSize: tabSize,
      insertSpaces: true,
      lineNumbers: showLineNumbers ? 'on' : 'off',
      minimap: { enabled: showMinimap },
      wordWrap: wordWrap ? 'on' : 'off',
      quickSuggestions: codeCompletion ? {
        other: true,
        comments: true,
        strings: true,
      } : false,
      suggestOnTriggerCharacters: codeCompletion,
      acceptSuggestionOnCommitCharacter: codeCompletion,
      acceptSuggestionOnEnter: codeCompletion ? 'on' : 'off'
    });
    
    // Also set on the model
    if (editor.getModel()) {
      editor.getModel().updateOptions({
        tabSize: tabSize,
        insertSpaces: true
      });
    }
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

  // Detect status changes and trigger glow animation
  useEffect(() => {
    if (prevStatusRef.current !== codeStatus) {
      console.log('Status changed from', prevStatusRef.current, 'to', codeStatus);
      setIsStatusGlowing(true);
      prevStatusRef.current = codeStatus;
      
      // Remove glow after animation completes
      const timer = setTimeout(() => {
        setIsStatusGlowing(false);
      }, 2000); // Glow for 2 seconds
      
      return () => clearTimeout(timer);
    }
  }, [codeStatus]);

  // Update editor options when settings change
  useEffect(() => {
    console.log('Editor settings updated:', { tabSize, fontSize, showLineNumbers, showMinimap, wordWrap, codeCompletion });
    console.log('Current code in store:', code.substring(0, 100) + '...');
    if (editorRef.current) {
      // Update editor options
      editorRef.current.updateOptions({
        tabSize: tabSize,
        insertSpaces: true,
        fontSize: fontSize,
        lineNumbers: showLineNumbers ? 'on' : 'off',
        minimap: { enabled: showMinimap },
        wordWrap: wordWrap ? 'on' : 'off',
        quickSuggestions: codeCompletion ? {
          other: true,
          comments: true,
          strings: true,
        } : false,
        suggestOnTriggerCharacters: codeCompletion,
        acceptSuggestionOnCommitCharacter: codeCompletion,
        acceptSuggestionOnEnter: codeCompletion ? 'on' : 'off'
      });
      
      // Also update model options
      const model = editorRef.current.getModel();
      if (model) {
        model.updateOptions({
          tabSize: tabSize,
          insertSpaces: true
        });
      }
    }
  }, [tabSize, fontSize, showLineNumbers, showMinimap, wordWrap, codeCompletion]);

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
            <Circle className={`h-2 w-2 fill-current ${getStatusColor()} ${isStatusGlowing ? 'animate-pulse drop-shadow-lg' : ''}`} 
                    style={isStatusGlowing ? {
                      filter: `drop-shadow(0 0 8px ${getStatusColor() === 'text-warning' ? '#fbbf24' : 
                                                    getStatusColor() === 'text-success' ? '#10b981' : 
                                                    getStatusColor() === 'text-primary' ? '#3b82f6' : 
                                                    getStatusColor() === 'text-destructive' ? '#ef4444' : '#6b7280'})`
                    } : {}} />
            <span className={`text-xs ${getStatusColor()} ${isStatusGlowing ? 'animate-pulse font-semibold' : ''}`}
                  style={isStatusGlowing ? {
                    textShadow: `0 0 8px ${getStatusColor() === 'text-warning' ? '#fbbf24' : 
                                          getStatusColor() === 'text-success' ? '#10b981' : 
                                          getStatusColor() === 'text-primary' ? '#3b82f6' : 
                                          getStatusColor() === 'text-destructive' ? '#ef4444' : '#6b7280'}`
                  } : {}}>
              {getStatusText()}
            </span>
          </div>
        </div>
        <div className="w-6 h-6 flex items-center justify-center">
          {!isChatOpen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setChatOpen(true)}
              className="h-6 w-6 p-0 hover:bg-muted"
              title="Open AI Chat"
            >
              <Bot className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 monaco-editor-container">
        <Editor
          key={`editor-${tabSize}`}
          height="100%"
          language={language}
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          beforeMount={(monaco) => {
            monaco.editor.defineTheme('vs-dark', {
              base: 'vs-dark',
              inherit: true,
              rules: [],
              colors: {}
            });
          }}
          theme="vs-dark"
          options={{
            fontSize: fontSize,
            fontFamily: 'JetBrains Mono, Fira Code, Cascadia Code, SF Mono, Consolas, monospace',
            lineNumbers: showLineNumbers ? 'on' : 'off',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            minimap: { enabled: showMinimap },
            wordWrap: wordWrap ? 'on' : 'off',
            tabSize: tabSize,
            insertSpaces: true,
            detectIndentation: false,
            renderLineHighlight: 'line',
            selectionHighlight: false,
            bracketPairColorization: { enabled: true },
            
            // Enhanced IntelliSense and suggestions
            suggestOnTriggerCharacters: codeCompletion,
            quickSuggestions: codeCompletion ? {
              other: true,
              comments: true,
              strings: true,
            } : false,
            quickSuggestionsDelay: 100,
            acceptSuggestionOnCommitCharacter: codeCompletion,
            acceptSuggestionOnEnter: codeCompletion ? 'on' : 'off',
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
            // lightbulb: { enabled: true },
            
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
              // cursorMoveOnFindWidget: true,
              seedSearchStringFromSelection: 'always',
              autoFindInSelection: 'never',
            },
          }}
        />
      </div>
    </div>
  );
};