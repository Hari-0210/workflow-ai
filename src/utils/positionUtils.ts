/**
 * Utility functions for position and coordinate calculations
 */

import { NODE_DIMENSIONS } from '../constants/nodeTypes';

/**
 * Convert screen coordinates to canvas coordinates
 */
export function screenToCanvasCoords(
    screenX: number,
    screenY: number,
    canvasState: { zoom: number; panX: number; panY: number }
): { x: number; y: number } {
    return {
        x: (screenX - canvasState.panX) / canvasState.zoom,
        y: (screenY - canvasState.panY) / canvasState.zoom,
    };
}

/**
 * Convert canvas coordinates to screen coordinates
 */
export function canvasToScreenCoords(
    canvasX: number,
    canvasY: number,
    canvasState: { zoom: number; panX: number; panY: number }
): { x: number; y: number } {
    return {
        x: canvasX * canvasState.zoom + canvasState.panX,
        y: canvasY * canvasState.zoom + canvasState.panY,
    };
}

/**
 * Calculate drop position for new node from drag event
 */
export function calculateDropPosition(
    event: DragEvent,
    canvasRef: HTMLDivElement | null,
    canvasState: { zoom: number; panX: number; panY: number }
): { x: number; y: number } | null {
    if (!canvasRef) return null;

    const rect = canvasRef.getBoundingClientRect();
    const screenX = event.clientX - rect.left;
    const screenY = event.clientY - rect.top;

    const canvasCoords = screenToCanvasCoords(screenX, screenY, canvasState);

    // Center the node at drop position
    return {
        x: canvasCoords.x - NODE_DIMENSIONS.WIDTH / 2,
        y: canvasCoords.y - NODE_DIMENSIONS.HEIGHT / 2,
    };
}

/**
 * Clamp zoom level to valid range
 */
export function clampZoom(zoom: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, zoom));
}

/**
 * Calculate distance between two points
 */
export function calculateDistance(
    p1: { x: number; y: number },
    p2: { x: number; y: number }
): number {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Check if point is within bounds
 */
export function isPointInBounds(
    point: { x: number; y: number },
    bounds: { x: number; y: number; width: number; height: number }
): boolean {
    return (
        point.x >= bounds.x &&
        point.x <= bounds.x + bounds.width &&
        point.y >= bounds.y &&
        point.y <= bounds.y + bounds.height
    );
}
