import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { useEffect } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import type { NavigateFunction } from 'react-router-dom';

export type Href = string | { url: string };

export type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    href: Href;
    children?: ReactNode;
    prefetch?: boolean;
    preserveScroll?: boolean;
};

export type VisitOptions = {
    replace?: boolean;
    preserveScroll?: boolean;
    preserveState?: boolean;
};

export function toUrl(href: Href): string {
    return typeof href === 'string' ? href : href.url;
}

let navigator: NavigateFunction | null = null;

export function NavigationBridge() {
    const navigate = useNavigate();

    useEffect(() => {
        navigator = navigate;
    }, [navigate]);

    return null;
}

export function Link({ href, prefetch, preserveScroll, ...anchor }: LinkProps) {
    void prefetch;
    void preserveScroll;

    return <RouterLink to={toUrl(href)} {...anchor} />;
}

export function useCurrentUrl(): string {
    const { pathname, search } = useLocation();

    return `${pathname}${search}`;
}

export function navigate(url: string, options: VisitOptions = {}) {
    navigator?.(url, { replace: options.replace });
}

export function navigateWithQuery(url: string, query: Record<string, string>, options: VisitOptions = {}) {
    const params = new URLSearchParams(query).toString();

    navigate(params === '' ? url : `${url}?${params}`, options);
}

export function reload({ only }: { only?: string[] } = {}) {
    void only;
    navigator?.(0);
}
