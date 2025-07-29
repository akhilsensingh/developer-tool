import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bot, ArrowRight, ArrowLeft, Sparkles, Settings } from 'lucide-react';

interface AINodeData {
  label: string;
  model: string;
}

export const AINode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as AINodeData;
  const models = [
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'gpt-3.5', label: 'GPT-3.5' },
    { value: 'claude', label: 'Claude' },
    { value: 'gemini', label: 'Gemini' },
  ];

  return (
    <Card className={`min-w-[240px] border-2 transition-all ${
      selected ? 'border-node-selected shadow-glow' : 'border-node-border hover:border-node-border/80'
    }`}>
      <div className="p-3 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded">
              <Bot className="h-3 w-3 text-primary" />
            </div>
            <span className="text-sm font-medium">{nodeData.label}</span>
          </div>
          <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
            <Sparkles className="h-3 w-3 mr-1" />
            AI
          </Badge>
        </div>

        {/* Model Selector */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">AI Model</label>
          <Select defaultValue={nodeData.model}>
            <SelectTrigger className="text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model.value} value={model.value} className="text-xs">
                  {model.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Configuration */}
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" className="text-xs h-7">
            <Settings className="h-3 w-3 mr-1" />
            Configure
          </Button>
          <Badge variant="outline" className="text-xs">
            Active
          </Badge>
        </div>

        {/* Connection indicators */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" />
            <span>Prompt</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Response</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-primary border-2 border-background"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-primary border-2 border-background"
      />
    </Card>
  );
});