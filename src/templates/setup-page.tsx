import { PageHeader, SectionLayout, ServiceStatusList, SetupChecklist } from '@/components/company-os';
import type { ServiceStatus, SetupStep } from '@/components/company-os';
import { adminPermissions, organizationGroups } from './organization-nav';

const steps: SetupStep[] = [
    { key: 'organisation', title: 'Name your organisation and set its timezone', done: true, links: [{ label: 'Workspace', href: '/templates/workspace-page' }] },
    { key: 'team', title: 'Invite a second person', done: false, links: [{ label: 'Users', href: '/templates/users-page' }] },
    { key: 'security', title: 'Require two-factor for privileged roles', done: false, links: [{ label: 'Workspace', href: '/templates/workspace-page' }] },
    { key: 'lists', title: 'Review the lead sources, stages and priorities', done: null, links: [{ label: 'Lead sources', href: '#' }, { label: 'Stages', href: '#' }] },
    { key: 'services', title: 'Mail and queue are configured', done: true, links: [] },
];

const services: ServiceStatus[] = [
    { key: 'mail', label: 'Mail', ok: true, env: ['MAIL_MAILER', 'MAIL_HOST', 'MAIL_FROM_ADDRESS'] },
    { key: 'queue', label: 'Queue', ok: true, env: ['QUEUE_CONNECTION'] },
    { key: 'broadcasting', label: 'Broadcasting', ok: false, env: ['BROADCAST_CONNECTION', 'PUSHER_APP_KEY'] },
];

export function SetupPage() {
    return (
        <SectionLayout title="Organization" groups={organizationGroups} permissions={adminPermissions}>
            <div className="flex flex-col gap-6">
                <PageHeader title="Setup" />
                <SetupChecklist steps={steps} finishing={false} onFinish={() => undefined}>
                    <ServiceStatusList services={services} />
                </SetupChecklist>
            </div>
        </SectionLayout>
    );
}
