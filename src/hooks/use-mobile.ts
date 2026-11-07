import { useSyncExternalStore } from 'react';

const MOBILE_BREAKPOINT = 768;

const mql =
    typeof window === 'undefined'
        ? undefined
        : window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

function subscribe(callback: (event: MediaQueryListEvent) => void) {
    if (!mql) {
        return () => {};
    }

    mql.addEventListener('change', callback);

    return () => mql.removeEventListener('change', callback);
}

export function useIsMobile(): boolean {
    return useSyncExternalStore(
        subscribe,
        () => mql?.matches ?? false,
        () => false,
    );
}
