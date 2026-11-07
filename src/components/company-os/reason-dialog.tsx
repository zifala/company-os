import { useState } from 'react';
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

export function ReasonDialog({
    trigger,
    open: controlledOpen,
    onOpenChange,
    title,
    consequence,
    confirmLabel,
    cancelLabel = 'Keep it',
    destructive = true,
    processing = false,
    error,
    onConfirm,
    confirmName,
    reason,
    onReasonChange,
    errors = {},
    minLength = 3,
    labels: custom,
}: ConfirmDialogProps & {
    confirmName?: string;
    reason: string;
    onReasonChange: (reason: string) => void;
    errors?: { reason?: string };
    minLength?: number;
    labels?: Partial<ReasonLabels>;
}) {
    const labels = { ...reasonLabels, ...custom };
    const [open, setOpen] = useControllableOpen(controlledOpen, onOpenChange);
    const [typedName, setTypedName] = useState('');
    const nameMatches = confirmName === undefined || typedName.trim() === confirmName.trim();
    const ready = nameMatches && reason.trim().length >= minLength;

    const change = (next: boolean) => {
        setOpen(next);

        if (!next) {
            setTypedName('');
        }
    };

    return (
        <Dialog open={open} onOpenChange={change}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{consequence}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-2">
                    <Label htmlFor="reason-dialog-reason">{labels.reason}</Label>
                    <Textarea
                        id="reason-dialog-reason"
                        value={reason}
                        onChange={(event) => onReasonChange(event.target.value)}
                    />
                    {errors.reason && <p className="text-sm text-rose-600">{errors.reason}</p>}
                </div>
                {confirmName !== undefined && (
                    <div className="grid gap-2">
                        <Label htmlFor="reason-dialog-name">{labels.typeName(confirmName)}</Label>
                        <Input
                            id="reason-dialog-name"
                            autoComplete="off"
                            value={typedName}
                            onChange={(event) => setTypedName(event.target.value)}
                        />
                    </div>
                )}
                {error && <p className="text-sm text-rose-600">{error}</p>}
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => change(false)}>
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
            </DialogContent>
        </Dialog>
    );
}
