import { useCurrentUrl } from '@/lib/navigation';

const base = 'http://localhost';

const matchScore = (href: string, current: URL): number => {
    const target = new URL(href, base);
    const path = target.pathname.replace(/\/$/, '');
    const params = [...target.searchParams];
    const onPath =
        current.pathname === target.pathname ||
        current.pathname.startsWith(`${path}/`);
    const onQuery = params.every(
        ([key, value]) => current.searchParams.get(key) === value,
    );

    return onPath && onQuery ? path.length * 100 + params.length : -1;
};

export function useActiveNavHref(hrefs: string[]): string | null {
    const current = new URL(useCurrentUrl(), base);

    return hrefs.reduce<{ href: string | null; score: number }>(
        (best, href) => {
            const score = matchScore(href, current);

            return score > best.score ? { href, score } : best;
        },
        { href: null, score: -1 },
    ).href;
}
