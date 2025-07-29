import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Zap, ArrowRight, ArrowLeft } from 'lucide-react';

interface ProcessNodeData {
  label: string;
  operation: string;
}

export const ProcessNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as ProcessNodeData;
  const operations = [
    { value: 'transform', label: 'Transform' },
    { value: 'filter', label: 'Filter' },
    { value: 'validate', label: 'Validate' },
    { value: 'format', label: 'Format' },
  ];

  return (
    <Card className={`min-w-[220px] border-2 transition-all ${
      selected ? 'border-node-selected shadow-glow' : 'border-node-border hover:border-node-border/80'
    }`}>
      <div className="p-3 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-yellow-500/10 rounded">
              <Zap className="h-3 w-3 text-yellow-400" />
            </div>
            <span className="text-sm font-medium">{nodeData.label}</span>
          </div>
          <Badge variant="secondary" className="text-xs bg-yellow-500/10 text-yellow-400">
            Process
          </Badge>
        </div>

        {/* Operation Selector */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Operation</label>
          <Select defaultValue={nodeData.operation}>
            <SelectTrigger className="text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {operations.map((op) => (
                <SelectItem key={op.value} value={op.value} className="text-xs">
                  {op.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Connection indicators */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" />
            <span>Input</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Output</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-yellow-500 border-2 border-background"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-yellow-500 border-2 border-background"
      />
    </Card>
  );
});