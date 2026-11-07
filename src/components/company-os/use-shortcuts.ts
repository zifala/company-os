import { useEffect, useRef } from 'react';
import { goShortcuts } from '@/components/company-os/nav';
import type { NavGroup } from '@/components/company-os/nav';

export type ShortcutHandlers = {
    groups: NavGroup[];
    permissions: string[];
    onPalette: () => void;
    onQuickCreate: () => void;
    onHelp: () => void;
    onCreate?: () => void;
    onNavigate: (url: string) => void;
};

const goWindowMs = 1200;

const isTyping = (target: EventTarget | null): boolean =>
    target instanceof HTMLElement &&
    (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));

const dialogOpen = (): boolean => document.querySelector('[role="dialog"]') !== null;

export function useShortcuts(handlers: ShortcutHandlers) {
    const latest = useRef(handlers);

    useEffect(() => {
        latest.current = handlers;
    }, [handlers]);

    useEffect(() => {
        let awaitingGo = 0;

        const onKey = (event: KeyboardEvent) => {
            const { groups, permissions, onPalette, onQuickCreate, onHelp, onCreate, onNavigate } =
                latest.current;
            const key = event.key.toLowerCase();

            if ((event.metaKey || event.ctrlKey) && key === 'k') {
                event.preventDefault();
                onPalette();

                return;
            }

            if (isTyping(event.target) || dialogOpen() || event.metaKey || event.ctrlKey || event.altKey) {
                return;
            }

            const destination = goShortcuts(groups, permissions).find((shortcut) => shortcut.key === key);

            if (destination && Date.now() - awaitingGo < goWindowMs) {
                awaitingGo = 0;
                event.preventDefault();
                onNavigate(destination.url);

                return;
            }

            if (key === 'g') {
                awaitingGo = Date.now();

                return;
            }

            const single: Record<string, (() => void) | undefined> = {
                '?': onHelp,
                '/': onPalette,
                n: onQuickCreate,
                c: onCreate,
            };
            const handler = single[event.key] ?? single[key];

            if (handler) {
                event.preventDefault();
                handler();
            }
        };

        window.addEventListener('keydown', onKey);

        return () => window.removeEventListener('keydown', onKey);
    }, []);
}
