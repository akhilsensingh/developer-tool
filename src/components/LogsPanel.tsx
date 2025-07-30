import { X, Terminal, AlertCircle, CheckCircle, Info, AlertTriangle, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/useAppStore';
import { useRef, useEffect, useState } from 'react';

export const LogsPanel = () => {
  const { logs, isLogsOpen, setLogsOpen, clearLogs, logsPanelHeight, setLogsPanelHeight } = useAppStore();
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);

  if (!isLogsOpen) return null;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const container = resizeRef.current?.parentElement;
      if (!container) return;
      
      const containerRect = container.getBoundingClientRect();
      const newHeight = containerRect.bottom - e.clientY;
      
      // Clamp height between 100px and 400px
      const clampedHeight = Math.max(100, Math.min(400, newHeight));
      setLogsPanelHeight(clampedHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, setLogsPanelHeight]);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getLogBadgeVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (type) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'outline';
      case 'success':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <div 
      ref={resizeRef}
      className="border-t border-border bg-card flex flex-col"
      style={{ height: `${logsPanelHeight}px` }}
    >
      {/* Header */}
      {/* Resize Handle */}
      <div
        className="h-2 bg-border cursor-ns-resize hover:bg-primary/20 transition-colors flex items-center justify-center"
        onMouseDown={handleResizeStart}
        title="Drag to resize"
      >
        <ChevronUp className="h-3 w-3 text-muted-foreground" />
      </div>
      <div className="flex items-center justify-between px-3 py-1 border-b border-border">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Execution Logs</span>
          <Badge variant="secondary" className="text-xs">
            {logs.length}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearLogs}
            className="text-xs"
          >
            Clear
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLogsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Logs Content */}
      <ScrollArea className="flex-1 p-3">
        {logs.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            No logs yet. Run your code to see execution details.
          </div>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                {getLogIcon(log.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={getLogBadgeVariant(log.type)} className="text-xs">
                      {log.type.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {log.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm font-mono break-words">{log.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};