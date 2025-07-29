import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Workflow, ArrowRight, ArrowLeft, Settings, Play } from 'lucide-react';

interface WorkflowNodeData {
  label: string;
  workflowType: string;
  status: string;
}

export const WorkflowNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as WorkflowNodeData;
  const workflowTypes = [
    { value: 'sequential', label: 'Sequential' },
    { value: 'parallel', label: 'Parallel' },
    { value: 'conditional', label: 'Conditional' },
    { value: 'loop', label: 'Loop' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-500/10 text-blue-400';
      case 'completed': return 'bg-green-500/10 text-green-400';
      case 'failed': return 'bg-red-500/10 text-red-400';
      default: return 'bg-gray-500/10 text-gray-400';
    }
  };

  return (
    <Card className={`min-w-[250px] border-2 transition-all ${
      selected ? 'border-node-selected shadow-glow' : 'border-node-border hover:border-node-border/80'
    }`}>
      <div className="p-3 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-orange-500/10 rounded">
              <Workflow className="h-3 w-3 text-orange-400" />
            </div>
            <span className="text-sm font-medium">{nodeData.label}</span>
          </div>
          <Badge variant="secondary" className="text-xs bg-orange-500/10 text-orange-400">
            Workflow
          </Badge>
        </div>

        {/* Workflow Type Selector */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Type</label>
          <Select defaultValue={nodeData.workflowType || 'sequential'}>
            <SelectTrigger className="text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {workflowTypes.map((type) => (
                <SelectItem key={type.value} value={type.value} className="text-xs">
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status and Controls */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className={`text-xs ${getStatusColor(nodeData.status || 'idle')}`}>
            {nodeData.status || 'Idle'}
          </Badge>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="text-xs h-7">
              <Settings className="h-3 w-3 mr-1" />
              Config
            </Button>
            <Button variant="outline" size="sm" className="text-xs h-7">
              <Play className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Connection indicators */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" />
            <span>Trigger</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Complete</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-orange-500 border-2 border-background"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-orange-500 border-2 border-background"
      />
    </Card>
  );
});