import { CircleAlertIcon, CircleCheckIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export type ServiceStatus = {
    key: string;
    label: string;
    ok: boolean;
    env: string[];
};

export type ServiceStatusLabels = {
    title: string;
    ok: string;
    missing: string;
    set: string;
};

export const serviceStatusLabels: ServiceStatusLabels = {
    title: 'Services',
    ok: 'Configured',
    missing: 'Missing',
    set: 'Set in the server environment',
};

export function ServiceStatusList({
    services,
    action,
    labels: custom,
}: {
    services: ServiceStatus[];
    action?: ReactNode;
    labels?: Partial<ServiceStatusLabels>;
}) {
    const labels = { ...serviceStatusLabels, ...custom };

    return (
        <section className="rounded-lg glass">
            <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
                <h2 className="text-sm font-semibold text-slate-800">{labels.title}</h2>
                {action}
            </div>
            <ul>
                {services.map((service) => {
                    const Icon = service.ok ? CircleCheckIcon : CircleAlertIcon;

                    return (
                        <li key={service.key} className="grid gap-1 border-b border-border px-5 py-3 text-sm last:border-0">
                            <div className="flex items-center gap-3">
                                <span className="font-medium text-slate-800">{service.label}</span>
                                <span className={service.ok ? 'ml-auto inline-flex items-center gap-1.5 text-success' : 'ml-auto inline-flex items-center gap-1.5 text-warning'}>
                                    <Icon className="size-4" aria-hidden />
                                    {service.ok ? labels.ok : labels.missing}
                                </span>
                            </div>
                            {service.env.length > 0 && (
                                <p className="font-mono text-xs text-muted-foreground" title={labels.set}>
                                    {service.env.join(' · ')}
                                </p>
                            )}
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
