import { useState } from 'react';
import type { Node } from '../types';
import './WorkflowNode.css';

interface WorkflowNodeProps {
    node: Node;
    isSelected: boolean;
    onNodeClick: (nodeId: string) => void;
    onNodeDragStart: (e: React.MouseEvent, nodeId: string) => void;
    onNodeDragEnd: (e: React.MouseEvent, nodeId: string) => void;
    onPortMouseDown: (e: React.MouseEvent, nodeId: string, portType: 'input' | 'output') => void;
    onPortMouseUp: (e: React.MouseEvent, nodeId: string, portType: 'input' | 'output') => void;
    onDeleteNode: (nodeId: string) => void;
}

const nodeIcons: Record<string, string> = {
    trigger: '⚡',
    webhook: '🔗',
    http: '🌐',
    database: '💾',
    email: '📧',
    condition: '🔀',
    filter: '🔍',
    transform: '🔄',
    merge: '🔗'
};

const nodeColors: Record<string, string> = {
    trigger: 'var(--node-trigger)',
    webhook: 'var(--node-trigger)',
    http: 'var(--node-action)',
    database: 'var(--node-action)',
    email: 'var(--node-action)',
    condition: 'var(--node-condition)',
    filter: 'var(--node-condition)',
    transform: 'var(--node-transform)',
    merge: 'var(--node-transform)'
};

export default function WorkflowNode({
    node,
    isSelected,
    onNodeClick,
    onNodeDragStart,
    onNodeDragEnd,
    onPortMouseDown,
    onPortMouseUp,
    onDeleteNode
}: WorkflowNodeProps) {
    const icon = nodeIcons[node.type] || '📦';
    const color = nodeColors[node.type] || 'var(--node-action)';
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
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onClick={handleClick}
        >
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
        </div>
    );
}
