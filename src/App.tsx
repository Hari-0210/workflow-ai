import { useState } from 'react';
import Canvas from './components/Canvas';
import NodeLibrary from './components/NodeLibrary';
import type { Node, Connection } from './types';
import './index.css';
import './App.css';

function App() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);

  return (
    <div className="app">
      <NodeLibrary />
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

