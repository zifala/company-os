import { FieldRow, FormSection, PageHeader, PhoneField, SectionLayout } from '@/components/company-os';
import type { NavGroup } from '@/components/company-os';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OptionSelect } from '@/components/ui/option-select';

const settingsGroups: NavGroup[] = [
    {
        items: [
            { title: 'Profile', href: '/templates/settings-page' },
            { title: 'Password', href: '/templates/settings/password' },
            { title: 'Security', href: '/templates/settings/security' },
            { title: 'Notifications', href: '/templates/settings/notifications' },
        ],
    },
];

const timezones = [{ value: 'Africa/Mogadishu', label: 'Africa/Mogadishu' }, { value: 'Africa/Nairobi', label: 'Africa/Nairobi' }, { value: 'Europe/London', label: 'Europe/London' }];
const hours = Array.from({ length: 24 }, (_, hour) => ({ value: `${String(hour).padStart(2, '0')}:00`, label: `${String(hour).padStart(2, '0')}:00` }));

export function SettingsPage() {
    return (
        <SectionLayout title="Settings" groups={settingsGroups} permissions={[]}>
            <div className="flex max-w-3xl flex-col gap-6">
                <PageHeader title="Profile">
                    <Button>Save profile</Button>
                </PageHeader>
                <FormSection title="You">
                    <FieldRow id="sp-name" label="Name">
                        <Input id="sp-name" defaultValue="Ayaan Warsame" />
                    </FieldRow>
                    <FieldRow id="sp-email" label="Email">
                        <Input id="sp-email" type="email" defaultValue="ayaan@halcyon.example" />
                    </FieldRow>
                    <PhoneField id="sp-phone" label="Phone" defaultValue="+252612345678" />
                    <FieldRow id="sp-locale" label="Language">
                        <OptionSelect id="sp-locale" defaultValue="en" options={[{ value: 'en', label: 'English' }, { value: 'so', label: 'Soomaali' }]} />
                    </FieldRow>
                </FormSection>
                <FormSection title="Time">
                    <FieldRow id="sp-tz" label="Timezone" hint="Due dates and reminders follow this.">
                        <OptionSelect id="sp-tz" defaultValue="Africa/Mogadishu" options={timezones} />
                    </FieldRow>
                    <div className="grid grid-cols-2 gap-4">
                        <FieldRow id="sp-quiet-start" label="Quiet hours start">
                            <OptionSelect id="sp-quiet-start" defaultValue="22:00" options={hours} />
                        </FieldRow>
                        <FieldRow id="sp-quiet-end" label="Quiet hours end" hint="Email waits until then.">
                            <OptionSelect id="sp-quiet-end" defaultValue="07:00" options={hours} />
                        </FieldRow>
                    </div>
                </FormSection>
            </div>
        </SectionLayout>
    );
}
