import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Layers, Zap, Database, Globe, Brain, Code, Workflow } from 'lucide-react';

interface NodeTypeConfig {
  type: string;
  label: string;
  icon: any;
  color: string;
  description: string;
}

interface NodePaletteProps {
  onAddNode: (type: string) => void;
}

export const NodePalette = ({ onAddNode }: NodePaletteProps) => {
  const nodeTypeConfigs: NodeTypeConfig[] = [
    { 
      type: 'input', 
      label: 'Input', 
      icon: Layers, 
      color: 'bg-blue-500/10 text-blue-400',
      description: 'Data input source'
    },
    { 
      type: 'process', 
      label: 'Process', 
      icon: Zap, 
      color: 'bg-yellow-500/10 text-yellow-400',
      description: 'Data transformation'
    },
    { 
      type: 'ai', 
      label: 'AI', 
      icon: Brain, 
      color: 'bg-primary/10 text-primary',
      description: 'AI processing node'
    },
    { 
      type: 'output', 
      label: 'Output', 
      icon: Database, 
      color: 'bg-green-500/10 text-green-400',
      description: 'Data output destination'
    },
    { 
      type: 'code', 
      label: 'Code', 
      icon: Code, 
      color: 'bg-purple-500/10 text-purple-400',
      description: 'Custom code execution'
    },
    { 
      type: 'workflow', 
      label: 'Workflow', 
      icon: Workflow, 
      color: 'bg-orange-500/10 text-orange-400',
      description: 'Workflow orchestration'
    },
  ];

  return (
    <Card className="p-4 bg-card/95 backdrop-blur-sm shadow-editor min-w-[280px]">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <Plus className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">Node Palette</span>
          <Badge variant="secondary" className="text-xs ml-auto">
            {nodeTypeConfigs.length}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {nodeTypeConfigs.map(({ type, label, icon: Icon, color, description }) => (
            <Button
              key={type}
              variant="outline"
              onClick={() => onAddNode(type)}
              className="justify-start h-auto p-3 flex-col items-start gap-2 group hover:shadow-node"
            >
              <div className="flex items-center gap-2 w-full">
                <div className={`p-1.5 rounded ${color}`}>
                  <Icon className="h-3 w-3" />
                </div>
                <span className="text-xs font-medium">{label}</span>
              </div>
              <span className="text-xs text-muted-foreground text-left group-hover:text-foreground transition-colors">
                {description}
              </span>
            </Button>
          ))}
        </div>
        
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Drag nodes onto the canvas to build your workflow
          </p>
        </div>
      </div>
    </Card>
  );
};