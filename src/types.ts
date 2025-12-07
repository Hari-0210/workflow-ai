export interface Position {
    x: number;
    y: number;
}

export interface Node {
    id: string;
    type: string;
    position: { x: number; y: number };
    label: string;
    data: NodeConfig;
    executionStatus?: 'idle' | 'running' | 'completed' | 'error';
}

export interface Connection {
    id: string;
    sourceNodeId: string;
    targetNodeId: string;
}

export interface NodeType {
    type: string;
    label: string;
    icon: string;
    color: string;
    category: string;
    description: string;
}

export interface CanvasState {
    zoom: number;
    panX: number;
    panY: number;
}

export interface NodeConfig {
    stepId?: number;
    stepName?: string;
    type?: 'api' | 'sftp' | 'transform';
    action?: {
        parameters?: {
            method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
            endpoint?: string;
            reqParameters?: Record<string, any>;
        };
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
}
