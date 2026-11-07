import { DetailCard } from '@/components/company-os/detail-card';
import { Link } from '@/lib/navigation';
import type { Href } from '@/lib/navigation';

export type OnboardingSummary = {
    reference: string;
    href: Href;
    started_by: string;
    approved_by: string | null;
    approved_at: string | null;
    source: string;
    referrer: string | null;
};

export type OnboardingLabels = {
    title: string;
    reference: string;
    startedBy: string;
    approvedBy: string;
    approved: string;
    source: string;
    referredBy: string;
};

export const onboardingLabels: OnboardingLabels = {
    title: 'Onboarding',
    reference: 'Reference',
    startedBy: 'Started by',
    approvedBy: 'Approved by',
    approved: 'Approved',
    source: 'Source',
    referredBy: 'Referred by',
};

export function OnboardingCard({
    onboarding,
    labels = onboardingLabels,
}: {
    onboarding: OnboardingSummary | null;
    labels?: OnboardingLabels;
}) {
    if (onboarding === null) {
        return null;
    }

    return (
        <DetailCard
            title={labels.title}
            compact
            details={[
                {
                    label: labels.reference,
                    value: (
                        <Link href={onboarding.href} className="font-mono text-xs hover:text-primary hover:underline">
                            {onboarding.reference}
                        </Link>
                    ),
                },
                { label: labels.startedBy, value: onboarding.started_by },
                { label: labels.approvedBy, value: onboarding.approved_by },
                { label: labels.approved, value: onboarding.approved_at },
                { label: labels.source, value: onboarding.source },
                { label: labels.referredBy, value: onboarding.referrer },
            ]}
        />
    );
}
