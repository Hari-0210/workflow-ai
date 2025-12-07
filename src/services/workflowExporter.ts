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
            type: string;
            method?: string;
            apiEndpoint?: string;
            parameters?: {
                reqParameters?: any;
            };
        };
        retry?: {
            maxAttempts: number;
            delaySeconds: number;
        };
        statusCheck?: {
            type: string;
            expectedOutput: any;
        };
        condition?: string;
        delayBeforeExecution?: number;
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
 * Note: This is a simplified version. Full implementation would require
 * proper topological sorting and complete config mapping.
 */
export function exportToCustomFormat(
    _nodes: Node[],
    _connections: Connection[],
    workflowId: string = '1',
    workflowName: string = 'Workflow'
): WorkflowJSON {
    // TODO: Implement proper topological sort and config mapping
    // This is a placeholder that returns the basic structure

    return {
        workflowId,
        workflowName,
        steps: [],
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
