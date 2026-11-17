import { CircleAlertIcon, PowerOffIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export type WebhookEndpointState = {
    active: boolean;
    failingSince: string | null;
    disabledAt: string | null;
    disabledBy: string | null;
    disabledReason: string | null;
};

export type WebhookEndpointStatusLabels = {
    failingTitle: string;
    failing: (since: string, days: number) => string;
    disabledTitle: string;
    disabledBySystem: (at: string) => string;
    disabledByPerson: (at: string, by: string) => string;
    enable: string;
};

export const webhookEndpointStatusLabels: WebhookEndpointStatusLabels = {
    failingTitle: 'Deliveries are failing',
    failing: (since, days) => `Every attempt since ${since} failed. Retries continue; after ${days} days of failure the endpoint turns itself off.`,
    disabledTitle: 'This endpoint is off',
    disabledBySystem: (at) => `Turned off automatically on ${at}. Nothing is sent until it is enabled again.`,
    disabledByPerson: (at, by) => `Turned off by ${by} on ${at}. Nothing is sent until it is enabled again.`,
    enable: 'Enable endpoint',
};

export function WebhookEndpointStatus({
    endpoint,
    disableAfterDays = 3,
    canManage,
    processing = false,
    onEnable,
    labels: custom,
}: {
    endpoint: WebhookEndpointState;
    disableAfterDays?: number;
    canManage: boolean;
    processing?: boolean;
    onEnable: () => void;
    labels?: Partial<WebhookEndpointStatusLabels>;
}) {
    const labels = { ...webhookEndpointStatusLabels, ...custom };

    if (!endpoint.active) {
        const at = endpoint.disabledAt ?? '';

        return (
            <Alert variant="destructive">
                <PowerOffIcon />
                <AlertTitle>{labels.disabledTitle}</AlertTitle>
                <AlertDescription className="grid gap-3">
                    <p>{endpoint.disabledBy ? labels.disabledByPerson(at, endpoint.disabledBy) : labels.disabledBySystem(at)}</p>
                    {endpoint.disabledReason && <p className="border-l-2 border-current/30 pl-3 italic">{endpoint.disabledReason}</p>}
                    {canManage && (
                        <div>
                            <Button size="sm" variant="outline" disabled={processing} onClick={onEnable}>
                                {labels.enable}
                            </Button>
                        </div>
                    )}
                </AlertDescription>
            </Alert>
        );
    }

    if (endpoint.failingSince) {
        return (
            <Alert className="border-warning/40 bg-warning/5">
                <CircleAlertIcon className="text-warning" />
                <AlertTitle>{labels.failingTitle}</AlertTitle>
                <AlertDescription>{labels.failing(endpoint.failingSince, disableAfterDays)}</AlertDescription>
            </Alert>
        );
    }

    return null;
}
