import type { ComponentType } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { FieldRow, PasswordInput, PhoneField, RemoteCombobox, VerifyPhoneDialog } from '@/components/company-os';
import type { RemoteOption } from '@/components/company-os';
import { Button } from '@/components/ui/button';

const companies: RemoteOption[] = [
    { value: '1', label: 'Halcyon Freight' },
    { value: '2', label: 'Northwind Trading' },
    { value: '3', label: 'Kestrel Logistics' },
    { value: '4', label: 'Bluepeak Retail' },
    { value: '5', label: 'Saxansaxo Water' },
];

const searchCompanies = (term: string) =>
    new Promise<RemoteOption[]>((resolve) => {
        window.setTimeout(() => resolve(companies.filter((company) => company.label.toLowerCase().includes(term.toLowerCase()))), 250);
    });

function RemoteComboboxDemo() {
    const [value, setValue] = useState('');

    return (
        <div className="max-w-sm">
            <RemoteCombobox aria-label="Company" placeholder="Search companies" value={value} onValueChange={setValue} search={searchCompanies} />
        </div>
    );
}

function VerifyPhoneDemo() {
    const [open, setOpen] = useState(false);
    const [phone, setPhone] = useState('+252612345678');
    const [sending, setSending] = useState(false);
    const [sentTo, setSentTo] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [codeError, setCodeError] = useState<string>();

    const send = () => {
        setSending(true);
        window.setTimeout(() => {
            setSending(false);
            setSentTo(phone);
        }, 600);
    };

    const confirm = (code: string) => {
        setProcessing(true);
        window.setTimeout(() => {
            setProcessing(false);
            if (code !== '123456') {
                setCodeError('That code did not match. Check the SMS or send a new one.');

                return;
            }
            setCodeError(undefined);
            setOpen(false);
            setSentTo(null);
            toast.success('Phone confirmed');
        }, 600);
    };

    return (
        <>
            <Button variant="outline" onClick={() => setOpen(true)}>
                Confirm phone
            </Button>
            <VerifyPhoneDialog
                open={open}
                onOpenChange={setOpen}
                title="Confirm phone"
                description="We send a six-digit code by SMS. In this demo the code is 123456."
                phone={phone}
                onPhoneChange={setPhone}
                onSend={send}
                sending={sending}
                sentTo={sentTo}
                onConfirm={confirm}
                confirmLabel="Confirm phone"
                processing={processing}
                codeError={codeError}
            />
        </>
    );
}

export const formDemos: Record<string, ComponentType> = {
    'phone-field-basic': () => (
        <div className="max-w-sm">
            <PhoneField id="demo-phone" label="Phone" defaultValue="+252612345678" />
        </div>
    ),
    'password-input-basic': () => (
        <div className="max-w-sm">
            <FieldRow id="demo-password" label="New password">
                <PasswordInput id="demo-password" autoComplete="new-password" defaultValue="correct horse battery" />
            </FieldRow>
        </div>
    ),
    'remote-combobox-basic': RemoteComboboxDemo,
    'verify-phone-dialog-basic': VerifyPhoneDemo,
};
