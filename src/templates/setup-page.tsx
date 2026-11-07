import { PageHeader, SectionLayout, SetupChecklist } from '@/components/company-os';
import type { SetupStep } from '@/components/company-os';
import { adminPermissions, organizationGroups } from './organization-nav';

const steps: SetupStep[] = [
    { key: 'organisation', title: 'Name your organisation and set its timezone', done: true, links: [{ label: 'Workspace', href: '/templates/workspace' }] },
    { key: 'team', title: 'Invite a second person', done: false, links: [{ label: 'Users', href: '/templates/users-page' }] },
    { key: 'security', title: 'Require two-factor for privileged roles', done: false, links: [{ label: 'Workspace', href: '/templates/workspace' }] },
    { key: 'lists', title: 'Review the lead sources, stages and priorities', done: null, links: [{ label: 'Lead sources', href: '#' }, { label: 'Stages', href: '#' }] },
    { key: 'services', title: 'Mail and queue are configured', done: true, links: [] },
];

const services = [
    { label: 'Mail', ok: true, env: ['MAIL_MAILER', 'MAIL_HOST', 'MAIL_FROM_ADDRESS'] },
    { label: 'Queue', ok: true, env: ['QUEUE_CONNECTION'] },
    { label: 'Broadcasting', ok: false, env: ['BROADCAST_CONNECTION', 'PUSHER_APP_KEY'] },
];

export function SetupPage() {
    return (
        <SectionLayout title="Organization" groups={organizationGroups} permissions={adminPermissions}>
            <div className="flex flex-col gap-6">
                <PageHeader title="Setup" />
                <SetupChecklist steps={steps} finishing={false} onFinish={() => undefined}>
                    <section className="rounded-lg glass">
                        <h2 className="border-b border-border px-5 py-3 text-sm font-semibold text-slate-800">Services</h2>
                        <ul>
                            {services.map((service) => (
                                <li key={service.label} className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-3 text-sm last:border-0">
                                    <span className="w-28 font-medium text-slate-800">{service.label}</span>
                                    <span className={service.ok ? 'text-emerald-600' : 'text-amber-600'}>{service.ok ? 'Configured' : 'Missing'}</span>
                                    <span className="ml-auto font-mono text-xs text-muted-foreground">{service.env.join(' · ')}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                </SetupChecklist>
            </div>
        </SectionLayout>
    );
}
