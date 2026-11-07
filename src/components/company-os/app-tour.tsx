import { driver } from 'driver.js';
import type { DriveStep } from 'driver.js';
import { useEffect, useRef } from 'react';
import { useCurrentUrl } from '@/lib/navigation';
import 'driver.js/dist/driver.css';

export type TourStep = { target: string; title: string; description: string };

export type TourLabels = { next: string; back: string; done: string };

export const tourLabels: TourLabels = { next: 'Next', back: 'Back', done: 'Done' };

const isShown = (element: Element | null): element is Element => {
    const rect = element?.getBoundingClientRect();

    return rect !== undefined && rect.width > 0 && rect.height > 0;
};

export const visibleSteps = (steps: TourStep[]): DriveStep[] =>
    steps.flatMap(({ target, title, description }) => {
        const element = document.querySelector(`[data-tour="${target}"]`);

        return isShown(element) ? [{ element, popover: { title, description } }] : [];
    });

export function AppTour({
    steps,
    run,
    onFinish,
    labels: custom,
    delayMs = 1200,
}: {
    steps: TourStep[];
    run: boolean;
    onFinish: () => void;
    labels?: Partial<TourLabels>;
    delayMs?: number;
}) {
    const url = useCurrentUrl();
    const startedOnUrl = useRef<string | null>(null);
    const latest = useRef({ steps, onFinish, labels: { ...tourLabels, ...custom } });

    useEffect(() => {
        latest.current = { steps, onFinish, labels: { ...tourLabels, ...custom } };
    }, [steps, onFinish, custom]);

    useEffect(() => {
        if (!run || startedOnUrl.current === url) {
            return;
        }

        const start = window.setTimeout(() => {
            const { steps: current, onFinish: finish, labels } = latest.current;
            const tourSteps = visibleSteps(current);

            if (tourSteps.length === 0) {
                return;
            }

            startedOnUrl.current = url;
            driver({
                steps: tourSteps,
                showProgress: true,
                overlayColor: 'var(--color-slate-900)',
                overlayOpacity: 0.55,
                stagePadding: 6,
                stageRadius: 8,
                disableActiveInteraction: true,
                animate: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
                nextBtnText: labels.next,
                prevBtnText: labels.back,
                doneBtnText: labels.done,
                onDestroyed: () => {
                    startedOnUrl.current = null;
                    finish();
                },
            }).drive();
        }, delayMs);

        return () => window.clearTimeout(start);
    }, [url, run, delayMs]);

    return null;
}
