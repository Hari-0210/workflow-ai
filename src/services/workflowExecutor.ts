/**
 * Workflow executor service
 * This is where real API calls would be made in production
 */

import type { Node, NodeConfig } from '../types';
import { ANIMATION_DURATIONS } from '../constants/animations';

export interface ExecutionResult {
    success: boolean;
    data?: any;
    error?: string;
}

/**
 * Execute a node's action (mock implementation)
 * In production, this would make real API calls based on node configuration
 */
export async function executeNodeAction(
    node: Node,
    _config: NodeConfig
): Promise<ExecutionResult> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, ANIMATION_DURATIONS.NODE_EXECUTION));

    // Mock successful execution
    return {
        success: true,
        data: {
            nodeId: node.id,
            type: node.type,
            timestamp: new Date().toISOString(),
        },
    };
}

/**
 * Execute HTTP request (for HTTP nodes)
 */
export async function executeHttpRequest(
    _method: string,
    _endpoint: string,
    _parameters: any
): Promise<ExecutionResult> {
    try {
        // In production, make actual HTTP request
        // const response = await fetch(endpoint, { method, body: JSON.stringify(parameters) });

        // Mock response
        return {
            success: true,
            data: {
                status: 200,
                response: { message: 'Success' },
            },
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Execute SFTP operation (for SFTP nodes)
 */
export async function executeSftpOperation(
    operation: string,
    _parameters: any
): Promise<ExecutionResult> {
    // In production, connect to SFTP server and perform operation

    // Mock response
    return {
        success: true,
        data: {
            operation,
            filesProcessed: 10,
        },
    };
}
