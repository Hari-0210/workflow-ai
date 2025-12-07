/**
 * Node type definitions and configurations
 */

export const NODE_TYPES = {
    TRIGGER: 'trigger',
    WEBHOOK: 'webhook',
    HTTP: 'http',
    DATABASE: 'database',
    EMAIL: 'email',
    CONDITION: 'condition',
    FILTER: 'filter',
    TRANSFORM: 'transform',
    MERGE: 'merge',
} as const;

export type NodeType = typeof NODE_TYPES[keyof typeof NODE_TYPES];

/**
 * Node icons mapping
 */
export const NODE_ICONS: Record<string, string> = {
    [NODE_TYPES.TRIGGER]: '⚡',
    [NODE_TYPES.WEBHOOK]: '🔗',
    [NODE_TYPES.HTTP]: '🌐',
    [NODE_TYPES.DATABASE]: '💾',
    [NODE_TYPES.EMAIL]: '📧',
    [NODE_TYPES.CONDITION]: '🔀',
    [NODE_TYPES.FILTER]: '🔍',
    [NODE_TYPES.TRANSFORM]: '🔄',
    [NODE_TYPES.MERGE]: '🔗',
};

/**
 * Node colors mapping (CSS variables)
 */
export const NODE_COLORS: Record<string, string> = {
    [NODE_TYPES.TRIGGER]: 'var(--node-trigger)',
    [NODE_TYPES.WEBHOOK]: 'var(--node-trigger)',
    [NODE_TYPES.HTTP]: 'var(--node-action)',
    [NODE_TYPES.DATABASE]: 'var(--node-action)',
    [NODE_TYPES.EMAIL]: 'var(--node-action)',
    [NODE_TYPES.CONDITION]: 'var(--node-condition)',
    [NODE_TYPES.FILTER]: 'var(--node-condition)',
    [NODE_TYPES.TRANSFORM]: 'var(--node-transform)',
    [NODE_TYPES.MERGE]: 'var(--node-transform)',
};

/**
 * Default node icon for unknown types
 */
export const DEFAULT_NODE_ICON = '📦';

/**
 * Default node color for unknown types
 */
export const DEFAULT_NODE_COLOR = 'var(--node-action)';

/**
 * Node dimensions
 */
export const NODE_DIMENSIONS = {
    WIDTH: 180,
    HEIGHT: 80,
    PORT_SIZE: 24,
    PORT_DOT_SIZE: 14,
} as const;

/**
 * Execution status types
 */
export const EXECUTION_STATUS = {
    IDLE: 'idle',
    RUNNING: 'running',
    COMPLETED: 'completed',
    ERROR: 'error',
} as const;

export type ExecutionStatus = typeof EXECUTION_STATUS[keyof typeof EXECUTION_STATUS];
