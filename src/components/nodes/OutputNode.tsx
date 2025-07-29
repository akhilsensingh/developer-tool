import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileOutput, ArrowLeft } from 'lucide-react';

interface OutputNodeData {
  label: string;
  value: string;
}

export const OutputNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as OutputNodeData;
  return (
    <Card className={`min-w-[200px] border-2 transition-all ${
      selected ? 'border-node-selected shadow-glow' : 'border-node-border hover:border-node-border/80'
    }`}>
      <div className="p-3 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-green-500/10 rounded">
              <FileOutput className="h-3 w-3 text-green-400" />
            </div>
            <span className="text-sm font-medium">{nodeData.label}</span>
          </div>
          <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-400">
            Output
          </Badge>
        </div>

        {/* Output Display */}
        <div className="space-y-2">
          <Textarea
            placeholder="Result will appear here..."
            value={nodeData.value}
            readOnly
            className="text-xs resize-none h-20"
          />
        </div>

        {/* Connection indicator */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ArrowLeft className="h-3 w-3" />
          <span>Data input</span>
        </div>
      </div>

      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-green-500 border-2 border-background"
      />
    </Card>
  );
});