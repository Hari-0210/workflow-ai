/**
 * Custom hook for workflow execution logic
 */

import { useState } from 'react';
import type { Node } from '../types';
import { updateNodeStatus, resetNodesStatus } from '../utils/nodeUtils';
import { buildExecutionOrder } from '../utils/connectionUtils';
import { EXECUTION_STATUS } from '../constants/nodeTypes';
import { ANIMATION_DURATIONS } from '../constants/animations';
import type { Connection } from '../types';

interface UseWorkflowExecutionProps {
    nodes: Node[];
    connections: Connection[];
    onNodesChange: (nodes: Node[]) => void;
}

export function useWorkflowExecution({
    nodes,
    connections,
    onNodesChange,
}: UseWorkflowExecutionProps) {
    const [isExecuting, setIsExecuting] = useState(false);

    /**
     * Execute a single node (mock implementation)
     */
    const executeNode = async (nodeId: string): Promise<void> => {
        return new Promise((resolve) => {
            // Update node to running
            onNodesChange(updateNodeStatus(nodes, nodeId, EXECUTION_STATUS.RUNNING));

            // Simulate API call with delay
            setTimeout(() => {
                // Update node to completed
                onNodesChange(updateNodeStatus(nodes, nodeId, EXECUTION_STATUS.COMPLETED));
                resolve();
            }, ANIMATION_DURATIONS.NODE_EXECUTION);
        });
    };

    /**
     * Execute entire workflow starting from a trigger node
     */
    const executeWorkflow = async (startNodeId: string) => {
        if (isExecuting) return;

        setIsExecuting(true);

        // Reset all nodes to idle
        onNodesChange(resetNodesStatus(nodes));

        // Build execution order by following connections
        const executionOrder = buildExecutionOrder(startNodeId, connections);

        // Execute nodes sequentially
        for (const nodeId of executionOrder) {
            await executeNode(nodeId);
        }

        setIsExecuting(false);
    };

    return {
        isExecuting,
        executeWorkflow,
    };
}
