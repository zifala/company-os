import { useState } from 'react';
import { CalendarFeedCard, PageHeader, PreferenceMatrix, SectionLayout } from '@/components/company-os';
import type { PreferenceChannel, PreferenceEvent, PreferenceValue } from '@/components/company-os';
import { Button } from '@/components/ui/button';
import { settingsGroups } from './settings-nav';

const events: PreferenceEvent[] = [
    { key: 'task_assigned', label: 'A task is assigned to you', group: 'Tasks' },
    { key: 'task_commented', label: 'Someone comments on your task', group: 'Tasks' },
    { key: 'mentioned', label: 'Someone mentions you', hint: 'Replaces the comment notification for that comment.', group: 'Tasks' },
    { key: 'tasks_changed_in_bulk', label: 'Your tasks change in bulk', hint: 'One digest per change, not one per task.', group: 'Tasks' },
    { key: 'deal_assigned', label: 'A deal is assigned to you', group: 'Deals' },
    { key: 'managed_deals_activity', label: 'Activity on deals in your department', hint: 'Off until you turn it on.', group: 'Deals' },
    { key: 'invoice_due_reminder', label: 'An invoice you own falls due', group: 'Reminders' },
    { key: 'morning_brief', label: 'Morning brief', hint: 'At 07:00 in your timezone.', group: 'Reminders' },
];

const channels: PreferenceChannel[] = [
    { key: 'in_app', label: 'In-app' },
    { key: 'email', label: 'Email' },
    { key: 'whatsapp', label: 'WhatsApp', available: false, unavailableHint: 'Add a phone number on your profile first.' },
];

const initial: PreferenceValue = {
    task_assigned: { in_app: true, email: true },
    task_commented: { in_app: true },
    mentioned: { in_app: true, email: true },
    tasks_changed_in_bulk: { in_app: true },
    deal_assigned: { in_app: true, email: true },
    managed_deals_activity: {},
    invoice_due_reminder: { in_app: true, email: true },
    morning_brief: { email: true },
};

export function NotificationSettings() {
    const [value, setValue] = useState(initial);
    const [feed, setFeed] = useState<{ active: boolean; url: string | null }>({ active: false, url: null });
    const [saving, setSaving] = useState(false);
    const [feedProcessing, setFeedProcessing] = useState(false);
    const settleFeed = (next: { active: boolean; url: string | null }) => {
        setFeedProcessing(true);
        window.setTimeout(() => {
            setFeed(next);
            setFeedProcessing(false);
        }, 600);
    };

    return (
        <SectionLayout title="Settings" groups={settingsGroups} permissions={[]}>
            <div className="flex max-w-3xl flex-col gap-6">
                <PageHeader title="Notifications">
                    <Button
                        disabled={saving}
                        onClick={() => {
                            setSaving(true);
                            window.setTimeout(() => setSaving(false), 600);
                        }}
                    >
                        Save preferences
                    </Button>
                </PageHeader>
                <PreferenceMatrix events={events} channels={channels} value={value} onChange={setValue} disabled={saving} />
                <CalendarFeedCard
                    active={feed.active}
                    url={feed.url}
                    processing={feedProcessing}
                    onCreate={() => settleFeed({ active: true, url: 'https://app.halcyon.example/calendar/feed/r8Kd2QpX7vLm4Tn9Wc1Zb6Hs3Gy5Ja0Fe8Ui2Ow7.ics' })}
                    onRevoke={() => settleFeed({ active: false, url: null })}
                />
            </div>
        </SectionLayout>
    );
}
