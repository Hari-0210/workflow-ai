/**
 * Utility functions for connection operations
 */

import type { Connection } from '../types';

/**
 * Generate SVG path for connection line with bezier curve
 */
export function generateConnectionPath(
    start: { x: number; y: number },
    end: { x: number; y: number }
): string {
    const dx = end.x - start.x;
    const controlPointOffset = Math.abs(dx) * 0.5;

    const cp1x = start.x + controlPointOffset;
    const cp1y = start.y;
    const cp2x = end.x - controlPointOffset;
    const cp2y = end.y;

    return `M ${start.x} ${start.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${end.x} ${end.y}`;
}

/**
 * Find all nodes connected to a given node
 */
export function findConnectedNodes(
    nodeId: string,
    connections: Connection[],
    direction: 'outgoing' | 'incoming' | 'both' = 'both'
): string[] {
    const connectedIds = new Set<string>();

    connections.forEach(conn => {
        if (direction === 'outgoing' || direction === 'both') {
            if (conn.sourceNodeId === nodeId) {
                connectedIds.add(conn.targetNodeId);
            }
        }
        if (direction === 'incoming' || direction === 'both') {
            if (conn.targetNodeId === nodeId) {
                connectedIds.add(conn.sourceNodeId);
            }
        }
    });

    return Array.from(connectedIds);
}

/**
 * Build execution order by traversing connections from start node
 */
export function buildExecutionOrder(
    startNodeId: string,
    connections: Connection[]
): string[] {
    const executionOrder: string[] = [];
    const visited = new Set<string>();

    const traverse = (nodeId: string) => {
        if (visited.has(nodeId)) return;
        visited.add(nodeId);
        executionOrder.push(nodeId);

        // Find all outgoing connections
        const outgoingConnections = connections.filter(c => c.sourceNodeId === nodeId);
        outgoingConnections.forEach(conn => traverse(conn.targetNodeId));
    };

    traverse(startNodeId);
    return executionOrder;
}

/**
 * Generate unique connection ID
 */
export function generateConnectionId(): string {
    return `conn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if connection already exists between two nodes
 */
export function connectionExists(
    sourceId: string,
    targetId: string,
    connections: Connection[]
): boolean {
    return connections.some(
        conn => conn.sourceNodeId === sourceId && conn.targetNodeId === targetId
    );
}

/**
 * Remove connections related to a node
 */
export function removeNodeConnections(
    nodeId: string,
    connections: Connection[]
): Connection[] {
    return connections.filter(
        c => c.sourceNodeId !== nodeId && c.targetNodeId !== nodeId
    );
}
