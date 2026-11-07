import { Link as InertiaLink, router, usePage } from '@inertiajs/react';
import type { InertiaLinkProps } from '@inertiajs/react';
import type { ReactNode } from 'react';

export type Href = NonNullable<InertiaLinkProps['href']>;

export type LinkProps = Omit<InertiaLinkProps, 'href'> & {
    href: Href;
    children?: ReactNode;
};

export type VisitOptions = {
    replace?: boolean;
    preserveScroll?: boolean;
    preserveState?: boolean;
};

export function toUrl(href: Href): string {
    return typeof href === 'string' ? href : href.url;
}

export function NavigationBridge() {
    return null;
}

export function Link(props: LinkProps) {
    return <InertiaLink {...props} />;
}

export function useCurrentUrl(): string {
    return usePage().url;
}

export function navigate(url: string, options: VisitOptions = {}) {
    router.visit(url, options);
}

export function navigateWithQuery(url: string, query: Record<string, string>, options: VisitOptions = {}) {
    router.get(url, query, options);
}

export function reload(options: { only?: string[] } = {}) {
    router.reload(options);
}
