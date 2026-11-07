import type { ReactNode } from 'react';
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
import { useControllableOpen } from '@/hooks/use-controllable-open';

export type ConfirmDialogProps = {
    trigger?: ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    title: string;
    consequence: string;
    confirmLabel: string;
    cancelLabel?: string;
    destructive?: boolean;
    processing?: boolean;
    error?: string;
    onConfirm: () => void;
};

export function ConfirmDialog({
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
}: ConfirmDialogProps) {
    const [open, setOpen] = useControllableOpen(controlledOpen, onOpenChange);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{consequence}</DialogDescription>
                </DialogHeader>
                {error && <p className="text-sm text-rose-600">{error}</p>}
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                        {cancelLabel}
                    </Button>
                    <Button
                        type="button"
                        variant={destructive ? 'destructive' : 'default'}
                        disabled={processing}
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
