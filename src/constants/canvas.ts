/**
 * Canvas configuration constants
 */

export const CANVAS_CONFIG = {
    MIN_ZOOM: 0.5,
    MAX_ZOOM: 2,
    ZOOM_STEP: 0.1,
    DEFAULT_ZOOM: 1,
    DEFAULT_PAN_X: 0,
    DEFAULT_PAN_Y: 0,
} as const;

/**
 * Grid configuration
 */
export const GRID_CONFIG = {
    SIZE: 20,
    COLOR: 'rgba(255, 255, 255, 0.05)',
    ENABLED: false, // Can be toggled for snap-to-grid
} as const;

/**
 * Connection line configuration
 */
export const CONNECTION_CONFIG = {
    STROKE_WIDTH: 3,
    TEMP_STROKE_WIDTH: 3,
    CURVE_TENSION: 0.5,
    GRADIENT_ID: 'connectionGradient',
} as const;

/**
 * Port configuration
 */
export const PORT_CONFIG = {
    OFFSET_X: 0,
    OFFSET_Y: 40, // Center of node height
    INPUT_SIDE: 'left' as const,
    OUTPUT_SIDE: 'right' as const,
} as const;
