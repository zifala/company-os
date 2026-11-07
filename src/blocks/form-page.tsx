import { FieldRow, FormCancel, FormLayout, FormSection, PhoneField } from '@/components/company-os';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OptionSelect } from '@/components/ui/option-select';
import { Textarea } from '@/components/ui/textarea';

export function FormPage() {
    return (
        <FormLayout
            title="Create company"
            actions={
                <>
                    <FormCancel onCancel={() => undefined} />
                    <Button>Create company</Button>
                </>
            }
            side={
                <>
                    <FormSection compact title="Relationship">
                        <FieldRow id="fp-type" label="Type">
                            <OptionSelect id="fp-type" placeholder="Pick a type" options={[{ value: 'client', label: 'Client' }, { value: 'partner', label: 'Partner' }, { value: 'supplier', label: 'Supplier' }]} />
                        </FieldRow>
                        <FieldRow id="fp-source" label="Source">
                            <OptionSelect id="fp-source" placeholder="Pick a source" options={[{ value: 'referral', label: 'Referral' }, { value: 'website', label: 'Website' }, { value: 'event', label: 'Event' }]} />
                        </FieldRow>
                    </FormSection>
                    <FormSection compact title="Finance">
                        <FieldRow id="fp-terms" label="Payment terms">
                            <OptionSelect id="fp-terms" defaultValue="30" options={[{ value: '14', label: 'Net 14' }, { value: '30', label: 'Net 30' }, { value: '60', label: 'Net 60' }]} />
                        </FieldRow>
                        <FieldRow id="fp-currency" label="Currency">
                            <OptionSelect id="fp-currency" defaultValue="USD" options={[{ value: 'USD', label: 'USD' }, { value: 'SOS', label: 'SOS' }]} />
                        </FieldRow>
                    </FormSection>
                </>
            }
        >
            <FormSection title="Company">
                <FieldRow id="fp-name" label="Name">
                    <Input id="fp-name" placeholder="Halcyon Freight" />
                </FieldRow>
                <FieldRow id="fp-legal" label="Legal name">
                    <Input id="fp-legal" />
                </FieldRow>
                <FieldRow id="fp-reg" label="Registration number" error="A company with this registration number already exists: Kestrel Logistics.">
                    <Input id="fp-reg" defaultValue="REG-2021-0098" aria-invalid />
                </FieldRow>
                <FieldRow id="fp-industry" label="Industry">
                    <OptionSelect id="fp-industry" placeholder="Pick an industry" options={[{ value: 'logistics', label: 'Logistics' }, { value: 'retail', label: 'Retail' }, { value: 'health', label: 'Health' }]} />
                </FieldRow>
            </FormSection>
            <FormSection title="Contact">
                <PhoneField id="fp-phone" label="Phone" />
                <FieldRow id="fp-email" label="Email">
                    <Input id="fp-email" type="email" placeholder="ops@halcyon.example" />
                </FieldRow>
                <div className="sm:col-span-2">
                    <FieldRow id="fp-address" label="Address">
                        <Textarea id="fp-address" rows={2} />
                    </FieldRow>
                </div>
            </FormSection>
        </FormLayout>
    );
}
