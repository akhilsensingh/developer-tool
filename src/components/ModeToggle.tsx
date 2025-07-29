import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code, Eye, Workflow } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModeToggleProps {
  mode: 'code' | 'visual';
  onModeChange: (mode: 'code' | 'visual') => void;
}

export const ModeToggle = ({ mode, onModeChange }: ModeToggleProps) => {
  return (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
      <Button
        variant={mode === 'code' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('code')}
        className={cn(
          'flex items-center gap-2 text-xs h-8',
          mode === 'code' && 'bg-primary text-primary-foreground shadow-sm'
        )}
      >
        <Code className="h-3 w-3" />
        Code
      </Button>
      <Button
        disabled={true}
        variant={mode === 'visual' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('visual')}
        className={cn(
          'flex items-center gap-2 text-xs h-8',
          mode === 'visual' && 'bg-primary text-primary-foreground shadow-sm',
        )}
      >
        <Workflow className="h-3 w-3" />
        Visual
      </Button>
    </div>
  );
};