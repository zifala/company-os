import { PlusIcon } from 'lucide-react';
import type { ComponentType } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { ConfirmDialog, FormDialog, ReasonDialog } from '@/components/company-os';
import { FieldRow } from '@/components/company-os/field-row';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

function ConfirmDialogDemo() {
    const [open, setOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    const archive = async () => {
        setProcessing(true);
        await wait(800);
        setProcessing(false);
        setOpen(false);
        toast('Halcyon Freight archived');
    };

    return (
        <ConfirmDialog
            trigger={<Button variant="outline">Archive company</Button>}
            open={open}
            onOpenChange={setOpen}
            title="Archive Halcyon Freight"
            consequence="The company leaves every list. Its invoices and history stay, and you can restore it from Trash within 30 days."
            confirmLabel="Archive company"
            destructive={false}
            processing={processing}
            onConfirm={archive}
        />
    );
}

function ReasonDialogDemo() {
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState('');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<{ reason?: string }>({});

    const disable = async () => {
        setProcessing(true);
        await wait(800);
        setProcessing(false);

        if (reason.trim().length < 10) {
            setErrors({ reason: 'The reason must be at least 10 characters.' });

            return;
        }

        setErrors({});
        setReason('');
        setOpen(false);
        toast('Mahad Yusuf deactivated');
    };

    return (
        <ReasonDialog
            trigger={<Button variant="destructive">Deactivate user</Button>}
            open={open}
            onOpenChange={(next) => {
                setOpen(next);

                if (!next) {
                    setErrors({});
                }
            }}
            title="Deactivate Mahad Yusuf"
            consequence="Mahad loses access right away. Open work needs a successor. The audit log keeps who did this and why."
            confirmLabel="Deactivate user"
            confirmName="Mahad Yusuf"
            reason={reason}
            onReasonChange={setReason}
            errors={errors}
            processing={processing}
            onConfirm={disable}
        />
    );
}

function FormDialogDemo() {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string>();

    const save = async () => {
        setProcessing(true);
        await wait(600);
        setProcessing(false);

        if (name.trim() === '') {
            setError('A name is required.');

            return;
        }

        setError(undefined);
        setName('');
        setOpen(false);
        toast(`Lead source "${name.trim()}" added`);
    };

    return (
        <FormDialog
            trigger={
                <Button>
                    <PlusIcon /> Add lead source
                </Button>
            }
            open={open}
            onOpenChange={setOpen}
            title="Add lead source"
            description="Lead sources appear on every deal and in the pipeline report."
            submitLabel="Add lead source"
            processing={processing}
            onSubmit={save}
        >
            <FieldRow id="lead-source-name" label="Name" error={error}>
                <Input id="lead-source-name" value={name} placeholder="Referral" onChange={(event) => setName(event.target.value)} />
            </FieldRow>
        </FormDialog>
    );
}

export const dialogDemos: Record<string, ComponentType> = {
    'confirm-dialog': ConfirmDialogDemo,
    'reason-dialog': ReasonDialogDemo,
    'form-dialog': FormDialogDemo,
};
