import { useCallback, useState } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  Panel,
} from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Plus, Layers, Zap, Database, Globe } from 'lucide-react';

// Custom Node Types
import { InputNode } from './nodes/InputNode';
import { ProcessNode } from './nodes/ProcessNode';
import { OutputNode } from './nodes/OutputNode';
import { AINode } from './nodes/AINode';
import { CodeNode } from './nodes/CodeNode';
import { WorkflowNode } from './nodes/WorkflowNode';
import { NodePalette } from './NodePalette';

const nodeTypes = {
  input: InputNode,
  process: ProcessNode,
  output: OutputNode,
  ai: AINode,
  code: CodeNode,
  workflow: WorkflowNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    position: { x: 100, y: 100 },
    data: { label: 'Data Input', value: '' },
  },
  {
    id: '2',
    type: 'ai',
    position: { x: 300, y: 100 },
    data: { label: 'AI Processor', model: 'GPT-4' },
  },
  {
    id: '3',
    type: 'output',
    position: { x: 500, y: 100 },
    data: { label: 'Result Output', value: '' },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
];

interface VisualFlowProps {
  onNodeChange: (nodes: Node[]) => void;
}

export const VisualFlow = ({ onNodeChange }: VisualFlowProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeIdCounter, setNodeIdCounter] = useState(4);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodesUpdate = useCallback(
    (newNodes: Node[]) => {
      setNodes(newNodes);
      onNodeChange(newNodes);
    },
    [setNodes, onNodeChange]
  );

  const onNodeDragStop = useCallback(
    (event: any, node: Node) => {
      onNodeChange(nodes);
    },
    [nodes, onNodeChange]
  );

  const addNode = (type: string) => {
    const newNode: Node = {
      id: nodeIdCounter.toString(),
      type,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: getDefaultNodeData(type),
    };

    setNodes((nds) => [...nds, newNode]);
    setNodeIdCounter((id) => id + 1);
    onNodeChange([...nodes, newNode]);
  };

  const getDefaultNodeData = (type: string) => {
    switch (type) {
      case 'input':
        return { label: 'New Input', value: '' };
      case 'process':
        return { label: 'New Process', operation: 'transform' };
      case 'output':
        return { label: 'New Output', value: '' };
      case 'ai':
        return { label: 'AI Node', model: 'GPT-4' };
      case 'code':
        return { label: 'Code Block', code: '// Your code here', language: 'javascript' };
      case 'workflow':
        return { label: 'Workflow', workflowType: 'sequential', status: 'idle' };
      default:
        return { label: 'New Node' };
    }
  };


  return (
    <div className="h-full w-full bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid={true}
        snapGrid={[15, 15]}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        attributionPosition="bottom-right"
        proOptions={{ hideAttribution: true }}
        className="bg-background"
      >
        <Controls className="bg-card border border-border" />
        <MiniMap 
          className="bg-card border border-border rounded-lg"
            nodeColor={(node) => {
              switch (node.type) {
                case 'input': return '#3b82f6';
                case 'process': return '#eab308';
                case 'ai': return '#8b5cf6';
                case 'output': return '#10b981';
                case 'code': return '#a855f7';
                case 'workflow': return '#f97316';
                default: return '#6b7280';
              }
            }}
        />
        <Background gap={20} className="bg-background" />
        
        {/* Node Palette */}
        <Panel position="top-left">
          <NodePalette onAddNode={addNode} />
        </Panel>

        {/* Flow Stats */}
        <Panel position="top-right">
          <Card className="p-3 bg-card/95 backdrop-blur-sm shadow-chat">
            <div className="flex items-center gap-4 text-sm">
              <Badge variant="secondary" className="text-xs">
                Nodes: {nodes.length}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Edges: {edges.length}
              </Badge>
            </div>
          </Card>
        </Panel>
      </ReactFlow>
    </div>
  );
};