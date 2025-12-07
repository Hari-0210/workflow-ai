import { useState, useRef } from 'react';
import type { Node, Connection, NodeType, CanvasState, NodeConfig } from '../types';
import WorkflowNode from './WorkflowNode';
import NodeConfigPanel from './NodeConfigPanel';
import '../styles/components/Canvas.css';

interface CanvasProps {
    nodes: Node[];
    connections: Connection[];
    onNodesChange: (nodes: Node[]) => void;
    onConnectionsChange: (connections: Connection[]) => void;
}

export default function Canvas({ nodes, connections, onNodesChange, onConnectionsChange }: CanvasProps) {
    const [canvasState, setCanvasState] = useState<CanvasState>({ zoom: 1, panX: 0, panY: 0 });
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });
    const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    // Connection dragging state
    const [isDraggingConnection, setIsDraggingConnection] = useState(false);
    const [connectionDragStart, setConnectionDragStart] = useState<{ nodeId: string; portType: 'input' | 'output'; x: number; y: number } | null>(null);
    const [connectionDragEnd, setConnectionDragEnd] = useState<{ x: number; y: number } | null>(null);

    const canvasRef = useRef<HTMLDivElement>(null);

    // Config panel state - store nodeId instead of full node to avoid stale data
    const [configPanelOpen, setConfigPanelOpen] = useState(false);
    const [configNodeId, setConfigNodeId] = useState<string | null>(null);

    // Get current node data from nodes array (always fresh)
    const configNode = configNodeId ? nodes.find(n => n.id === configNodeId) || null : null;

    // Execution state
    const [isExecuting, setIsExecuting] = useState(false);

    // Handle drop from node library
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const nodeTypeData = e.dataTransfer.getData('application/nodeType');

        if (nodeTypeData && canvasRef.current) {
            const nodeType: NodeType = JSON.parse(nodeTypeData);
            const rect = canvasRef.current.getBoundingClientRect();

            // Calculate position accounting for zoom and pan
            const x = (e.clientX - rect.left - canvasState.panX) / canvasState.zoom;
            const y = (e.clientY - rect.top - canvasState.panY) / canvasState.zoom;

            const newNode: Node = {
                id: `node-${Date.now()}`,
                type: nodeType.type,
                position: { x, y },
                label: nodeType.label,
                data: {}
            };

            onNodesChange([...nodes, newNode]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    // Handle node dragging
    const handleNodeDragStart = (e: React.MouseEvent, nodeId: string) => {
        setDraggedNodeId(nodeId);
        const node = nodes.find(n => n.id === nodeId);
        if (node && canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            const offsetX = (e.clientX - rect.left - canvasState.panX) / canvasState.zoom - node.position.x;
            const offsetY = (e.clientY - rect.top - canvasState.panY) / canvasState.zoom - node.position.y;
            setDragOffset({ x: offsetX, y: offsetY });
        }
    };

    const handleNodeDragEnd = (e: React.MouseEvent) => {
        if (canvasRef.current && draggedNodeId) {
            const rect = canvasRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left - canvasState.panX) / canvasState.zoom - dragOffset.x;
            const y = (e.clientY - rect.top - canvasState.panY) / canvasState.zoom - dragOffset.y;

            const updatedNodes = nodes.map(node =>
                node.id === draggedNodeId ? { ...node, position: { x, y } } : node
            );
            onNodesChange(updatedNodes);
        }
        setDraggedNodeId(null);
    };

    // Handle canvas panning
    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains('canvas-content')) {
            setIsPanning(true);
            setPanStart({ x: e.clientX - canvasState.panX, y: e.clientY - canvasState.panY });
            setSelectedNodeId(null);
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isPanning) {
            setCanvasState(prev => ({
                ...prev,
                panX: e.clientX - panStart.x,
                panY: e.clientY - panStart.y
            }));
        }

        // Update node position in real-time while dragging
        if (draggedNodeId && canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left - canvasState.panX) / canvasState.zoom - dragOffset.x;
            const y = (e.clientY - rect.top - canvasState.panY) / canvasState.zoom - dragOffset.y;

            const updatedNodes = nodes.map(node =>
                node.id === draggedNodeId ? { ...node, position: { x, y } } : node
            );
            onNodesChange(updatedNodes);
        }

        // Update connection drag line
        if (isDraggingConnection && canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            setConnectionDragEnd({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        }
    };

    const handleMouseUp = () => {
        setIsPanning(false);
        setDraggedNodeId(null);

        // End connection drag
        if (isDraggingConnection) {
            setIsDraggingConnection(false);
            setConnectionDragStart(null);
            setConnectionDragEnd(null);
        }
    };

    // Handle zoom
    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = Math.min(Math.max(canvasState.zoom * delta, 0.1), 3);

        if (canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const newPanX = mouseX - (mouseX - canvasState.panX) * (newZoom / canvasState.zoom);
            const newPanY = mouseY - (mouseY - canvasState.panY) * (newZoom / canvasState.zoom);

            setCanvasState({ zoom: newZoom, panX: newPanX, panY: newPanY });
        }
    };

    // Handle port mouse down - start dragging connection
    const handlePortMouseDown = (e: React.MouseEvent, nodeId: string, portType: 'input' | 'output') => {
        e.stopPropagation();
        e.preventDefault();

        if (canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            setIsDraggingConnection(true);
            setConnectionDragStart({
                nodeId,
                portType,
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
            setConnectionDragEnd({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        }
    };

    // Handle port mouse up - complete connection
    const handlePortMouseUp = (e: React.MouseEvent, nodeId: string, portType: 'input' | 'output') => {
        e.stopPropagation();

        if (isDraggingConnection && connectionDragStart) {
            // Only create connection if dragging from output to input or vice versa
            if (connectionDragStart.nodeId !== nodeId && connectionDragStart.portType !== portType) {
                const newConnection: Connection = {
                    id: `conn-${Date.now()}`,
                    sourceNodeId: connectionDragStart.portType === 'output' ? connectionDragStart.nodeId : nodeId,
                    targetNodeId: connectionDragStart.portType === 'output' ? nodeId : connectionDragStart.nodeId
                };
                onConnectionsChange([...connections, newConnection]);
            }

            setIsDraggingConnection(false);
            setConnectionDragStart(null);
            setConnectionDragEnd(null);
        }
    };

    // Handle node deletion
    const handleDeleteNode = (nodeId: string) => {
        onNodesChange(nodes.filter(n => n.id !== nodeId));
        onConnectionsChange(connections.filter(c => c.sourceNodeId !== nodeId && c.targetNodeId !== nodeId));
        setSelectedNodeId(null);
    };

    // Handle node double-click to open config
    const handleNodeDoubleClick = (nodeId: string) => {
        setConfigNodeId(nodeId);
        setConfigPanelOpen(true);
    };

    // Handle config save
    const handleConfigSave = (nodeId: string, config: NodeConfig) => {
        const updatedNodes = nodes.map(node =>
            node.id === nodeId ? { ...node, data: config } : node
        );
        onNodesChange(updatedNodes);
    };

    // Mock execution function
    const executeNode = async (nodeId: string): Promise<void> => {
        return new Promise((resolve) => {
            // Update node to running
            onNodesChange(nodes.map(n =>
                n.id === nodeId ? { ...n, executionStatus: 'running' as const } : n
            ));

            // Simulate API call with delay
            setTimeout(() => {
                // Update node to completed
                onNodesChange(nodes.map(n =>
                    n.id === nodeId ? { ...n, executionStatus: 'completed' as const } : n
                ));
                resolve();
            }, 2000); // 2 second delay per node
        });
    };

    // Execute workflow sequentially
    const executeWorkflow = async (startNodeId: string) => {
        if (isExecuting) return;

        setIsExecuting(true);

        // Reset all nodes to idle
        onNodesChange(nodes.map(n => ({ ...n, executionStatus: 'idle' as const })));

        // Build execution order by following connections
        const executionOrder: string[] = [];
        const visited = new Set<string>();

        const traverse = (nodeId: string) => {
            if (visited.has(nodeId)) return;
            visited.add(nodeId);
            executionOrder.push(nodeId);

            // Find all connections from this node
            const outgoingConnections = connections.filter(c => c.sourceNodeId === nodeId);
            outgoingConnections.forEach(conn => traverse(conn.targetNodeId));
        };

        traverse(startNodeId);

        // Execute nodes sequentially
        for (const nodeId of executionOrder) {
            await executeNode(nodeId);
        }

        setIsExecuting(false);
    };

    // Handle workflow execution from Execute button
    const handleExecuteWorkflow = (nodeId: string) => {
        const node = nodes.find(n => n.id === nodeId);
        if (node && node.type === 'trigger') {
            executeWorkflow(nodeId);
        }
    };

    // Get node position in screen coordinates
    const getNodeScreenPosition = (nodeId: string) => {
        const node = nodes.find(n => n.id === nodeId);
        if (!node) return { x: 0, y: 0 };

        return {
            x: node.position.x * canvasState.zoom + canvasState.panX,
            y: node.position.y * canvasState.zoom + canvasState.panY
        };
    };

    // Get exact port position in screen coordinates
    const getPortPosition = (nodeId: string, portType: 'input' | 'output') => {
        const nodePos = getNodeScreenPosition(nodeId);
        const nodeWidth = 200; // Width of workflow-node
        const nodeHeight = 120; // Approximate height based on content

        if (portType === 'output') {
            // Output port is on the right side, middle
            return {
                x: nodePos.x + nodeWidth,
                y: nodePos.y + nodeHeight / 2
            };
        } else {
            // Input port is on the left side, middle
            return {
                x: nodePos.x,
                y: nodePos.y + nodeHeight / 2
            };
        }
    };

    // Generate SVG path for connection
    const generateConnectionPath = (sourcePos: { x: number; y: number }, targetPos: { x: number; y: number }) => {
        const dx = targetPos.x - sourcePos.x;
        const controlPointOffset = Math.abs(dx) * 0.5;

        return `M ${sourcePos.x} ${sourcePos.y} C ${sourcePos.x + controlPointOffset} ${sourcePos.y}, ${targetPos.x - controlPointOffset} ${targetPos.y}, ${targetPos.x} ${targetPos.y}`;
    };

    return (
        <div
            ref={canvasRef}
            className="canvas"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onWheel={handleWheel}
        >
            <div
                className="canvas-content"
                style={{
                    transform: `translate(${canvasState.panX}px, ${canvasState.panY}px) scale(${canvasState.zoom})`
                }}
            >
                {/* Render nodes */}
                {nodes.map(node => (
                    <WorkflowNode
                        key={node.id}
                        node={node}
                        isSelected={selectedNodeId === node.id}
                        onNodeClick={setSelectedNodeId}
                        onNodeDoubleClick={handleNodeDoubleClick}
                        onExecuteWorkflow={handleExecuteWorkflow}
                        onNodeDragStart={handleNodeDragStart}
                        onNodeDragEnd={handleNodeDragEnd}
                        onPortMouseDown={handlePortMouseDown}
                        onPortMouseUp={handlePortMouseUp}
                        onDeleteNode={handleDeleteNode}
                    />
                ))}
            </div>

            {/* SVG overlay for connections */}
            <svg className="connections-svg">
                {connections.map(conn => {
                    const sourcePos = getPortPosition(conn.sourceNodeId, 'output');
                    const targetPos = getPortPosition(conn.targetNodeId, 'input');

                    return (
                        <path
                            key={conn.id}
                            d={generateConnectionPath(sourcePos, targetPos)}
                            className="connection-line"
                            fill="none"
                            stroke="url(#connectionGradient)"
                            strokeWidth="3"
                        />
                    );
                })}

                {/* Temporary connection line while dragging */}
                {isDraggingConnection && connectionDragStart && connectionDragEnd && (
                    <path
                        d={generateConnectionPath(
                            { x: connectionDragStart.x, y: connectionDragStart.y },
                            { x: connectionDragEnd.x, y: connectionDragEnd.y }
                        )}
                        className="connection-line connection-temp"
                        fill="none"
                        stroke="rgba(102, 126, 234, 0.8)"
                        strokeWidth="3"
                        strokeDasharray="8,4"
                    />
                )}

                {/* Gradient definition */}
                <defs>
                    <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#667eea" />
                        <stop offset="100%" stopColor="#4facfe" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Zoom indicator */}
            <div className="zoom-indicator">
                {Math.round(canvasState.zoom * 100)}%
            </div>

            {/* Instructions overlay */}
            <div className="instructions">
                <div className="instruction-item">🖱️ Drag nodes from library</div>
                <div className="instruction-item">🔗 Drag from port to port to connect</div>
                <div className="instruction-item">🖐️ Drag canvas to pan</div>
                <div className="instruction-item">🔍 Scroll to zoom</div>
                <div className="instruction-item">⚙️ Double-click node to configure</div>
                <div className="instruction-item">▶️ Click Execute on Trigger to run workflow</div>
            </div>

            {/* Configuration Panel */}
            <NodeConfigPanel
                open={configPanelOpen}
                node={configNode}
                onClose={() => setConfigPanelOpen(false)}
                onSave={handleConfigSave}
            />
        </div>
    );
}
