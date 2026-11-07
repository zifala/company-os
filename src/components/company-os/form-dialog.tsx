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

export function FormDialog({
    trigger,
    open: controlledOpen,
    onOpenChange,
    title,
    description,
    submitLabel,
    cancelLabel = 'Cancel',
    processing = false,
    onSubmit,
    children,
}: {
    trigger?: ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    title: string;
    description?: string;
    submitLabel: string;
    cancelLabel?: string;
    processing?: boolean;
    onSubmit: () => void;
    children: ReactNode;
}) {
    const [open, setOpen] = useControllableOpen(controlledOpen, onOpenChange);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent>
                <form
                    className="grid gap-6"
                    onSubmit={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        onSubmit();
                    }}
                >
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        {description && <DialogDescription>{description}</DialogDescription>}
                    </DialogHeader>
                    {children}
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            {cancelLabel}
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {submitLabel}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
