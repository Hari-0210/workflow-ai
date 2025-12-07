/**
 * Utility functions for node operations
 */

import type { Node } from '../types';
import { NODE_DIMENSIONS, type ExecutionStatus } from '../constants/nodeTypes';

/**
 * Calculate node position in screen coordinates
 */
export function getNodeScreenPosition(
    node: Node,
    canvasState: { zoom: number; panX: number; panY: number }
): { x: number; y: number } {
    return {
        x: node.position.x * canvasState.zoom + canvasState.panX,
        y: node.position.y * canvasState.zoom + canvasState.panY,
    };
}

/**
 * Calculate port position in screen coordinates
 */
export function getPortPosition(
    node: Node,
    portType: 'input' | 'output',
    canvasState: { zoom: number; panX: number; panY: number }
): { x: number; y: number } {
    const screenPos = getNodeScreenPosition(node, canvasState);
    const scaledWidth = NODE_DIMENSIONS.WIDTH * canvasState.zoom;
    const scaledHeight = NODE_DIMENSIONS.HEIGHT * canvasState.zoom;

    return {
        x: portType === 'input' ? screenPos.x : screenPos.x + scaledWidth,
        y: screenPos.y + scaledHeight / 2,
    };
}

/**
 * Update node execution status
 */
export function updateNodeStatus(
    nodes: Node[],
    nodeId: string,
    status: ExecutionStatus
): Node[] {
    return nodes.map(n =>
        n.id === nodeId ? { ...n, executionStatus: status } : n
    );
}

/**
 * Reset all nodes to idle status
 */
export function resetNodesStatus(nodes: Node[]): Node[] {
    return nodes.map(n => ({ ...n, executionStatus: 'idle' }));
}

/**
 * Generate unique node ID
 */
export function generateNodeId(): string {
    return `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if a node is a trigger type
 */
export function isTriggerNode(node: Node): boolean {
    return node.type === 'trigger';
}
