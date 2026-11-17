import { useId, useState } from 'react';
import type { ConfirmDialogProps } from '@/components/company-os/confirm-dialog';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useControllableOpen } from '@/hooks/use-controllable-open';

export type ReasonLabels = {
    reason: string;
    typeName: (name: string) => string;
};

export const reasonLabels: ReasonLabels = {
    reason: 'Reason',
    typeName: (name) => `Type ${name} to confirm`,
};

type ReasonFields = {
    confirmName?: string;
    reason: string;
    onReasonChange: (reason: string) => void;
    errors?: { reason?: string };
    minLength?: number;
    labels?: Partial<ReasonLabels>;
};

export function ReasonDialog({
    trigger,
    open: controlledOpen,
    onOpenChange,
    ...body
}: ConfirmDialogProps & ReasonFields) {
    const [open, setOpen] = useControllableOpen(controlledOpen, onOpenChange);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent>
                <ReasonBody {...body} onCancel={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}

// Mounted only while the dialog is open, so the typed name starts empty on every open.
function ReasonBody({
    title,
    consequence,
    confirmLabel,
    cancelLabel = 'Keep it',
    destructive = true,
    processing = false,
    error,
    onConfirm,
    onCancel,
    confirmName,
    reason,
    onReasonChange,
    errors = {},
    minLength = 3,
    labels: custom,
}: Omit<ConfirmDialogProps, 'trigger' | 'open' | 'onOpenChange'> & ReasonFields & { onCancel: () => void }) {
    const labels = { ...reasonLabels, ...custom };
    const id = useId();
    const [typedName, setTypedName] = useState('');
    const nameMatches = confirmName === undefined || typedName.trim() === confirmName.trim();
    const ready = nameMatches && reason.trim().length >= minLength;

    return (
        <>
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{consequence}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-2">
                <Label htmlFor={`${id}-reason`}>{labels.reason}</Label>
                <Textarea
                    id={`${id}-reason`}
                    value={reason}
                    aria-invalid={errors.reason ? true : undefined}
                    aria-describedby={errors.reason ? `${id}-reason-error` : undefined}
                    onChange={(event) => onReasonChange(event.target.value)}
                />
                {errors.reason && <p id={`${id}-reason-error`} className="text-sm text-destructive">{errors.reason}</p>}
            </div>
            {confirmName !== undefined && (
                <div className="grid gap-2">
                    <Label htmlFor={`${id}-name`}>{labels.typeName(confirmName)}</Label>
                    <Input id={`${id}-name`} autoComplete="off" value={typedName} onChange={(event) => setTypedName(event.target.value)} />
                </div>
            )}
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <DialogFooter>
                <Button type="button" variant="outline" onClick={onCancel}>
                    {cancelLabel}
                </Button>
                <Button
                    type="button"
                    variant={destructive ? 'destructive' : 'default'}
                    disabled={processing || !ready}
                    onClick={onConfirm}
                >
                    {confirmLabel}
                </Button>
            </DialogFooter>
        </>
    );
}
