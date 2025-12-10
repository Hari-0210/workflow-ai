import { useState } from 'react';
import Canvas from './components/Canvas';
import NodeLibrary from './components/NodeLibrary';
import type { Node, Connection } from './types';
import './styles/index.css';
import './styles/App.css';

function App() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);

  const onLoadWorkflow = (workflow: any) => {
    const BASE_X = 50, BASE_Y = 100, GAP_X = 250, GAP_Y = 120;

    const triggerNode = {
      id: `node-trigger-${Date.now()}`,
      type: "trigger",
      position: { x: BASE_X, y: BASE_Y },
      label: "Trigger",
      data: {}
    };

    const newNodes = workflow.config.steps.map((s: any, i: number) => ({
      id: `node-${crypto.randomUUID()}`,
      type: s.type === "api" || s.type === "pollApi" ? "http" : s.type,
      position: { x: BASE_X + (i + 1) * GAP_X, y: BASE_Y + (i + 1) * GAP_Y },
      label: s.stepName,
      data: s
    }));

    const newConnections = [
      newNodes.length && { id: crypto.randomUUID(), sourceNodeId: triggerNode.id, targetNodeId: newNodes[0].id },
      ...newNodes.slice(0, -1).map((n: any, i: number) => ({
        id: crypto.randomUUID(),
        sourceNodeId: n.id,
        targetNodeId: newNodes[i + 1].id
      }))
    ].filter(Boolean);

    setNodes([triggerNode, ...newNodes]);
    setConnections(newConnections);
  };





  return (
    <div className="app">
      <NodeLibrary onLoadWorkflow={onLoadWorkflow} />
      <Canvas
        nodes={nodes}
        connections={connections}
        onNodesChange={setNodes}
        onConnectionsChange={setConnections}
      />
    </div>
  );
}

export default App;

