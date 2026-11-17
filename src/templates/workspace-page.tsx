import { useState } from 'react';
import { FieldRow, FormLayout, FormSection, LetterheadPreview, SectionLayout, ServiceStatusList } from '@/components/company-os';
import type { ServiceStatus } from '@/components/company-os';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OptionSelect } from '@/components/ui/option-select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Link } from '@/lib/navigation';
import { adminPermissions, organizationGroups } from './organization-nav';

const services: ServiceStatus[] = [
    { key: 'mail', label: 'Mail', ok: true, env: ['MAIL_MAILER', 'MAIL_HOST', 'MAIL_FROM_ADDRESS'] },
    { key: 'queue', label: 'Queue', ok: true, env: ['QUEUE_CONNECTION'] },
    { key: 'storage', label: 'File storage', ok: true, env: ['FILESYSTEM_DISK', 'AWS_BUCKET'] },
    { key: 'whatsapp', label: 'WhatsApp', ok: false, env: ['WHATSAPP_TOKEN', 'WHATSAPP_PHONE_NUMBER_ID'] },
];

const timezones = [
    { value: 'Africa/Mogadishu', label: 'Africa/Mogadishu (UTC+3)' },
    { value: 'Africa/Nairobi', label: 'Africa/Nairobi (UTC+3)' },
    { value: 'Europe/London', label: 'Europe/London (UTC+0)' },
];

export function WorkspacePage() {
    const [letterhead, setLetterhead] = useState({
        legalName: 'Halcyon Trading Company Ltd',
        address: 'KM4, Maka Al Mukarama Road\nMogadishu, Somalia',
        registration: 'Reg. no. SO-2019-04417',
        tax: 'TIN 300-118-552',
        contact: 'accounts@halcyon.example · +252 61 555 0144',
    });
    const [twoFactor, setTwoFactor] = useState(true);
    const set = (key: keyof typeof letterhead) => (event: { target: { value: string } }) => setLetterhead({ ...letterhead, [key]: event.target.value });

    return (
        <SectionLayout title="Organization" groups={organizationGroups} permissions={adminPermissions}>
            <FormLayout
                title="Workspace"
                actions={
                    <>
                        <Button variant="outline">Cancel</Button>
                        <Button>Save changes</Button>
                    </>
                }
                side={
                    <>
                        <LetterheadPreview
                            letterhead={{
                                legalName: letterhead.legalName,
                                lines: [...letterhead.address.split('\n'), [letterhead.registration, letterhead.tax].filter(Boolean).join(' · '), letterhead.contact],
                                logo: <span className="grid size-10 shrink-0 place-items-center rounded-sm bg-neutral-900 text-xs font-bold text-white">HT</span>,
                            }}
                        />
                        <ServiceStatusList
                            services={services}
                            action={
                                <Link href="/templates/setup-page" className="text-xs font-medium text-primary hover:underline">
                                    Open setup
                                </Link>
                            }
                        />
                    </>
                }
            >
                <FormSection title="General">
                    <FieldRow id="workspace-name" label="Display name" hint="Shown in the sidebar and in emails.">
                        <Input id="workspace-name" defaultValue="Halcyon" />
                    </FieldRow>
                    <FieldRow id="workspace-timezone" label="Default timezone" hint="New users start here; each person sets their own.">
                        <OptionSelect id="workspace-timezone" options={timezones} defaultValue="Africa/Mogadishu" />
                    </FieldRow>
                </FormSection>
                <FormSection title="Letterhead">
                    <FieldRow id="legal-name" label="Legal name">
                        <Input id="legal-name" value={letterhead.legalName} onChange={set('legalName')} />
                    </FieldRow>
                    <FieldRow id="registration" label="Registration number">
                        <Input id="registration" value={letterhead.registration} onChange={set('registration')} />
                    </FieldRow>
                    <FieldRow id="address" label="Address" hint="One line per printed line.">
                        <Textarea id="address" rows={3} value={letterhead.address} onChange={set('address')} />
                    </FieldRow>
                    <FieldRow id="tax" label="Tax number">
                        <Input id="tax" value={letterhead.tax} onChange={set('tax')} />
                    </FieldRow>
                    <FieldRow id="contact" label="Contact line" hint="Email and phone, as printed.">
                        <Input id="contact" value={letterhead.contact} onChange={set('contact')} />
                    </FieldRow>
                    <FieldRow id="logo" label="Logo" hint="PNG or SVG, at least 200 px tall.">
                        <Input id="logo" type="file" accept="image/png,image/svg+xml" />
                    </FieldRow>
                </FormSection>
                <FormSection title="Security" compact>
                    <div className="flex items-start gap-4">
                        <div className="grid flex-1 gap-1">
                            <label htmlFor="require-2fa" className="text-sm font-medium text-slate-800">
                                Require two-factor for privileged people
                            </label>
                            <p id="require-2fa-hint" className="text-xs text-muted-foreground">
                                Super admins and anyone holding a privileged permission are sent to Security until they confirm a code or add a passkey. Changing this asks for your password.
                            </p>
                        </div>
                        <Switch id="require-2fa" aria-describedby="require-2fa-hint" checked={twoFactor} onCheckedChange={setTwoFactor} />
                    </div>
                </FormSection>
            </FormLayout>
        </SectionLayout>
    );
}
