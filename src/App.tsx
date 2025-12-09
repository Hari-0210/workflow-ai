import { useState } from 'react';
import Canvas from './components/Canvas';
import NodeLibrary from './components/NodeLibrary';
import type { Node, Connection } from './types';
import './styles/index.css';
import './styles/App.css';

function App() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  console.log("nodes", nodes);
  // console.log("connections", connections);

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

