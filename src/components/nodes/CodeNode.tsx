import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Code, ArrowRight, ArrowLeft, Play, Edit } from 'lucide-react';

interface CodeNodeData {
  label: string;
  code: string;
  language: string;
}

export const CodeNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as CodeNodeData;

  return (
    <Card className={`min-w-[260px] border-2 transition-all ${
      selected ? 'border-node-selected shadow-glow' : 'border-node-border hover:border-node-border/80'
    }`}>
      <div className="p-3 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-500/10 rounded">
              <Code className="h-3 w-3 text-purple-400" />
            </div>
            <span className="text-sm font-medium">{nodeData.label}</span>
          </div>
          <Badge variant="secondary" className="text-xs bg-purple-500/10 text-purple-400">
            Code
          </Badge>
        </div>

        {/* Language Badge */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {nodeData.language || 'JavaScript'}
          </Badge>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="h-6 px-2">
              <Edit className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 px-2">
              <Play className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Code Editor */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Code</label>
          <Textarea
            placeholder="// Enter your code here..."
            defaultValue={nodeData.code}
            className="text-xs font-mono min-h-[80px] resize-none"
            rows={4}
          />
        </div>

        {/* Connection indicators */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" />
            <span>Input</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Result</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-purple-500 border-2 border-background"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-purple-500 border-2 border-background"
      />
    </Card>
  );
});