import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Database, ArrowRight } from 'lucide-react';

interface InputNodeData {
  label: string;
  value: string;
}

export const InputNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as InputNodeData;
  return (
    <Card className={`min-w-[200px] border-2 transition-all ${
      selected ? 'border-node-selected shadow-glow' : 'border-node-border hover:border-node-border/80'
    }`}>
      <div className="p-3 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-500/10 rounded">
              <Database className="h-3 w-3 text-blue-400" />
            </div>
            <span className="text-sm font-medium">{nodeData.label}</span>
          </div>
          <Badge variant="secondary" className="text-xs bg-blue-500/10 text-blue-400">
            Input
          </Badge>
        </div>

        {/* Input Field */}
        <div className="space-y-2">
          <Input
            placeholder="Enter data..."
            defaultValue={nodeData.value}
            className="text-xs"
          />
        </div>

        {/* Connection indicator */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Data output</span>
          <ArrowRight className="h-3 w-3" />
        </div>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-500 border-2 border-background"
      />
    </Card>
  );
});