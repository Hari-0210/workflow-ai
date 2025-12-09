/**
 * Workflow export/import service
 */

import type { Node, Connection } from '../types';

export interface WorkflowExport {
    version: string;
    name: string;
    description?: string;
    nodes: Node[];
    connections: Connection[];
    createdAt: string;
}

export interface WorkflowJSON {
    workflowId: string;
    workflowName: string;
    steps: Array<{
        stepId: number;
        stepName: string;
        type: string;
        action: {
            parameters?: any; // Flexible to support both API and SFTP structures
        };
        retry?: {
            maxAttempts?: number;
            delaySeconds?: number;
        };
        status?: {
            type?: string;
            parameters?: any;
            expectedOutput?: any;
        };
        condition?: string;
        delaySeconds?: number;
    }>;
}

/**
 * Export workflow to JSON format
 */
export function exportWorkflow(
    nodes: Node[],
    connections: Connection[],
    name: string = 'Untitled Workflow'
): WorkflowExport {
    return {
        version: '1.0.0',
        name,
        nodes,
        connections,
        createdAt: new Date().toISOString(),
    };
}

/**
 * Export workflow to custom JSON format (matching user's example)
 */
export function exportToCustomFormat(
    nodes: Node[],
    connections: Connection[],
    workflowId: string = '1',
    workflowName: string = 'Workflow'
): WorkflowJSON {
    // Build execution order using topological sort
    const executionOrder: string[] = [];
    const visited = new Set<string>();

    // Find trigger nodes (starting points)
    const triggerNodes = nodes.filter(n => n.type === 'trigger');

    // Traverse from each trigger
    const traverse = (nodeId: string) => {
        if (visited.has(nodeId)) return;
        visited.add(nodeId);
        executionOrder.push(nodeId);

        // Find outgoing connections
        const outgoing = connections.filter(c => c.sourceNodeId === nodeId);
        outgoing.forEach(conn => traverse(conn.targetNodeId));
    };

    triggerNodes.forEach(trigger => traverse(trigger.id));

    // Map nodes to steps
    const steps = executionOrder
        .map(nodeId => nodes.find(n => n.id === nodeId))
        .filter((node): node is Node => node !== undefined)
        .map(node => {
            const config = node.data || {};

            return {
                type: config.type || node.type,
                stepId: config.stepId || 0,
                stepName: config.stepName || node.label,
                action: config.action || {},
                ...(config.retry && { retry: config.retry }),
                ...(config.status && { status: config.status }),
                ...(config.condition && { condition: config.condition }),
                ...(config.delaySeconds && { delaySeconds: config.delaySeconds }),
            };
        });

    return {
        workflowId,
        workflowName,
        steps,
    };
}

/**
 * Import workflow from JSON
 */
export function importWorkflow(data: WorkflowExport): {
    nodes: Node[];
    connections: Connection[];
} {
    return {
        nodes: data.nodes,
        connections: data.connections,
    };
}

/**
 * Download workflow as JSON file
 */
export function downloadWorkflowJSON(workflow: WorkflowExport | WorkflowJSON, filename: string) {
    const json = JSON.stringify(workflow, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
}
