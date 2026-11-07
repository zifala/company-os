export const registryBase = (): string =>
    import.meta.env.VITE_REGISTRY_BASE ?? (typeof window === 'undefined' ? '' : window.location.origin);
