import { useState } from 'react';
import type { FormEvent } from 'react';
import { InputError } from '@/components/company-os/field-row';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type SaveViewLabels = { title: string; name: string; namePlaceholder: string; share: string; cancel: string; save: string };

export const saveViewLabels: SaveViewLabels = {
    title: 'Save view',
    name: 'Name',
    namePlaceholder: 'Overdue bugs',
    share: 'Share with everyone who can see this list',
    cancel: 'Cancel',
    save: 'Save view',
};

export function SaveViewDialog({
    open,
    onOpenChange,
    canShare,
    processing,
    error,
    onSave,
    labels = saveViewLabels,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    canShare: boolean;
    processing: boolean;
    error?: string;
    onSave: (data: { name: string; shared: boolean }) => void;
    labels?: SaveViewLabels;
}) {
    const [name, setName] = useState('');
    const [shared, setShared] = useState(false);

    const submit = (event: FormEvent) => {
        event.preventDefault();
        onSave({ name: name.trim(), shared });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={submit} className="grid gap-6">
                    <DialogHeader>
                        <DialogTitle>{labels.title}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-2">
                        <Label htmlFor="view-name" className="font-light">
                            {labels.name}
                        </Label>
                        <Input
                            id="view-name"
                            autoFocus
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder={labels.namePlaceholder}
                            aria-invalid={Boolean(error)}
                        />
                        <InputError message={error} />
                    </div>
                    {canShare && (
                        <Label className="flex items-center gap-2 font-light">
                            <Checkbox checked={shared} onCheckedChange={(checked) => setShared(checked === true)} />
                            {labels.share}
                        </Label>
                    )}
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            {labels.cancel}
                        </Button>
                        <Button type="submit" disabled={processing || name.trim() === ''}>
                            {labels.save}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
