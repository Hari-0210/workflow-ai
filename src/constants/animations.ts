/**
 * Animation timing constants
 */

export const ANIMATION_DURATIONS = {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
    NODE_EXECUTION: 2000,
} as const;

export const ANIMATION_DELAYS = {
    SHORT: 100,
    MEDIUM: 300,
    LONG: 500,
} as const;

/**
 * Transition timing functions
 */
export const TRANSITIONS = {
    FAST: 'var(--transition-fast)',
    NORMAL: 'var(--transition-normal)',
    SLOW: 'var(--transition-slow)',
} as const;

/**
 * Animation easing functions
 */
export const EASING = {
    EASE_IN_OUT: 'ease-in-out',
    EASE_OUT: 'ease-out',
    EASE_IN: 'ease-in',
    LINEAR: 'linear',
    BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;
