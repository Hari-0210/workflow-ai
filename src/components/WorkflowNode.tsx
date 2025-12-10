import { useState } from 'react';
import type { Node } from '../types';
import { NODE_ICONS, NODE_COLORS, DEFAULT_NODE_ICON, DEFAULT_NODE_COLOR } from '../constants/nodeTypes';
import '../styles/components/WorkflowNode.css';

interface WorkflowNodeProps {
    node: Node;
    isSelected: boolean;
    onNodeClick: (nodeId: string) => void;
    onNodeDoubleClick: (nodeId: string) => void;
    onExecuteWorkflow: (nodeId: string) => void;
    onNodeDragStart: (e: React.MouseEvent, nodeId: string) => void;
    onNodeDragEnd: (e: React.MouseEvent, nodeId: string) => void;
    onPortMouseDown: (e: React.MouseEvent, nodeId: string, portType: 'input' | 'output') => void;
    onPortMouseUp: (e: React.MouseEvent, nodeId: string, portType: 'input' | 'output') => void;
    onDeleteNode: (nodeId: string) => void;
    isExecuting: boolean;
}

export default function WorkflowNode({
    node,
    isSelected,
    onNodeClick,
    onNodeDoubleClick,
    onExecuteWorkflow,
    onNodeDragStart,
    onNodeDragEnd,
    onPortMouseDown,
    onPortMouseUp,
    onDeleteNode, isExecuting
}: WorkflowNodeProps) {
    const icon = NODE_ICONS[node.type] || DEFAULT_NODE_ICON;
    const color = NODE_COLORS[node.type] || DEFAULT_NODE_COLOR;
    const [isDragging, setIsDragging] = useState(false);

    const handleMouseDown = (e: React.MouseEvent) => {
        // Don't start drag if clicking on port or delete button
        if ((e.target as HTMLElement).closest('.node-port') ||
            (e.target as HTMLElement).closest('.node-delete')) {
            return;
        }

        e.stopPropagation();
        setIsDragging(true);
        onNodeClick(node.id);
        onNodeDragStart(e, node.id);
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        if (isDragging) {
            e.stopPropagation();
            setIsDragging(false);
            onNodeDragEnd(e, node.id);
        }
    };

    const handleClick = (e: React.MouseEvent) => {
        if (!isDragging) {
            e.stopPropagation();
            onNodeClick(node.id);
        }
    };

    const handleExecute = (e: React.MouseEvent) => {
        e.stopPropagation();
        onExecuteWorkflow(node.id);
    };

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onNodeDoubleClick(node.id);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDeleteNode(node.id);
    };

    const handleInputMouseDown = (e: React.MouseEvent) => {
        onPortMouseDown(e, node.id, 'input');
    };

    const handleInputMouseUp = (e: React.MouseEvent) => {
        onPortMouseUp(e, node.id, 'input');
    };

    const handleOutputMouseDown = (e: React.MouseEvent) => {
        onPortMouseDown(e, node.id, 'output');
    };

    const handleOutputMouseUp = (e: React.MouseEvent) => {
        onPortMouseUp(e, node.id, 'output');
    };

    return (
        <div
            className={`workflow-node ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}
            style={{
                left: `${node.position.x}px`,
                top: `${node.position.y}px`,
                '--node-color': color
            } as React.CSSProperties}
            data-status={node.executionStatus || 'idle'}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
        >
            {/* Execution Status Indicator */}
            {node.executionStatus && node.executionStatus !== 'idle' && (
                <div className={`execution-status ${node.executionStatus}`}></div>
            )}

            {/* Input Port */}
            <div
                className="node-port node-port-input"
                onMouseDown={handleInputMouseDown}
                onMouseUp={handleInputMouseUp}
                title="Input - Drag to connect"
            >
                <div className="port-dot"></div>
            </div>

            {/* Node Content */}
            <div className="node-content">
                <div className="node-icon">{icon}</div>
                <div className="node-label">{node.label}</div>
                <div className="node-type">{node.type}</div>
            </div>

            {/* Output Port */}
            <div
                className="node-port node-port-output"
                onMouseDown={handleOutputMouseDown}
                onMouseUp={handleOutputMouseUp}
                title="Output - Drag to connect"
            >
                <div className="port-dot"></div>
            </div>

            {/* Delete Button */}
            {isSelected && (
                <button
                    className="node-delete"
                    onClick={handleDelete}
                    title="Delete node"
                >
                    ×
                </button>
            )}

            {/* Execute Button for Trigger nodes */}
            {node.type === 'trigger' && (
                <button
                    className="node-execute"
                    onClick={handleExecute}
                    title="Execute workflow"
                    disabled={isExecuting}
                >
                    ▶
                </button>
            )}
        </div>
    );
}
