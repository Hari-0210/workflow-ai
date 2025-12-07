export interface Position {
    x: number;
    y: number;
}

export interface Node {
    id: string;
    type: string;
    position: Position;
    label: string;
    data?: any;
}

export interface Connection {
    id: string;
    sourceNodeId: string;
    targetNodeId: string;
    sourcePort?: string;
    targetPort?: string;
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
