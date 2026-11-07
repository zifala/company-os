# Status dialog

Rule: no status change fires on one click; light ones go through `ConfirmDialog`, serious ones through `ReasonDialog` posting a required reason.

Shape:
- `resources/js/components/confirm-dialog.tsx` — title, consequence, confirm label, Wayfinder action, optional `data`.
- `resources/js/components/reason-dialog.tsx` — same props; textarea `reason`, submit disabled under 3 chars, server error shown under it.
- `resources/js/hooks/use-controllable-open.ts` — both dialogs work with a trigger or opened from a menu item.
- Server side: dedicated route per verb, `ReasonRequest` on serious ones, Action stores the reason (see `actions`, `audit`).
- Pick: reject, send back, disable, revoke, delete, lose, cancel → `ReasonDialog`. Archive, restore, pause, resume, complete → `ConfirmDialog`.

Code:

```tsx
export function useControllableOpen(open?: boolean, onOpenChange?: (open: boolean) => void): [boolean, (open: boolean) => void] {
    const [ownOpen, setOwnOpen] = useState(false);

    return [open ?? ownOpen, onOpenChange ?? setOwnOpen];
}
```

```tsx
type Action = { url: string; method: 'post' | 'delete' | 'patch' | 'put' };

export function ReasonDialog({ trigger, title, consequence, confirmLabel, action, confirmName, open: controlledOpen, onOpenChange }: {
    trigger?: ReactNode; title: string; consequence: string; confirmLabel: string; action: Action; confirmName?: string;
    open?: boolean; onOpenChange?: (open: boolean) => void;
}) {
    const [open, setOpen] = useControllableOpen(controlledOpen, onOpenChange);
    const [typedName, setTypedName] = useState('');
    const form = useForm({ reason: '' });
    const nameMatches = !confirmName || typedName.trim() === confirmName;

    const submit = () =>
        form.submit(action.method, action.url, {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                setOpen(false);
            },
        });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{consequence}</DialogDescription>
                </DialogHeader>
                {confirmName && (
                    <div className="grid gap-2">
                        <Label htmlFor="confirm-name">{t('dialog.type_name', { name: confirmName })}</Label>
                        <Input id="confirm-name" value={typedName} onChange={(event) => setTypedName(event.target.value)} />
                    </div>
                )}
                <div className="grid gap-2">
                    <Label htmlFor="reason">{t('dialog.reason')}</Label>
                    <Textarea id="reason" value={form.data.reason} onChange={(event) => form.setData('reason', event.target.value)} />
                    <InputError message={form.errors.reason} />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>{t('dialog.keep')}</Button>
                    <Button variant="destructive" disabled={form.processing || !nameMatches || form.data.reason.trim().length < 3} onClick={submit}>
                        {confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
```

`ConfirmDialog`: same shell, no form; `router.visit(action.url, { method, data, preserveScroll: true, onStart, onFinish: close })`.

Server:

```php
final class ReasonRequest extends FormRequest
{
    /** @return array<string, mixed> */
    public function rules(): array
    {
        return ['reason' => ['required', 'string', 'min:3', 'max:1000']];
    }
}
```

```php
Route::post('<models>/{<model>}/disable', [<Model>StatusController::class, 'disable'])->name('<models>.disable')->can('disable', '<model>');
Route::post('<models>/{<model>}/archive', [<Model>StatusController::class, 'archive'])->name('<models>.archive')->can('archive', '<model>');
```

- One route per verb, one Action per verb. Never a generic `PATCH {status: …}`; no status field in the update form.
- Controller: `disable(ReasonRequest $request, <Model> $<model>, Disable<Model> $action)` → `$action->handle($<model>, $request->user(), $request->validated())` → `back()`.
- Each response carries `can.<verb>` flags from the policy; React shows the trigger only when true.

Use:

```tsx
<ReasonDialog
    trigger={<Button size="sm" variant="destructive">{t('<module>.delete')}</Button>}
    title={t('<module>.delete_title', { name: <model>.name })}
    consequence={t('<module>.delete_consequence')}
    confirmLabel={t('<module>.delete')}
    action={<models>.destroy(<model>.id)}
/>
```

- `consequence` says what happens and that history keeps who and why. One sentence.
- Confirm label names the object: "Delete file", not "Confirm". Cancel reads "Keep it".
- From a dropdown: menu item sets `open`, dialog rendered outside the menu with `open` + `onOpenChange`.
- All copy from lang (`t()` from the bilingual piece). No literals.
- Delete passes `confirmName={<model>.name}`: the confirm button stays off until the name is typed.
- Serious changes (`ReasonDialog`) only from the record's view page, never from a table row.
- Simple boolean in a simple table (active, visible) → row toggle → `ConfirmDialog` → its verb endpoint.

Test:
- HTTP: serious endpoint without `reason` → 422 on `reason`; with it → redirect, `properties.reason` stored.
- HTTP: confirm endpoint requires its verb route and policy; GET does nothing.
- HTTP: user without the verb's permission → 403, record unchanged, no activity row.
- HTTP: `reason` over 1000 chars → 422; verb on a record already in that state → 422 from the Action guard.
- `update` request carrying a `status` key does not change status.
- Optional browser check: confirm button disabled until 3 characters and, for delete, until the name matches.

Gotchas:
- The 3-char minimum is UX only. `ReasonRequest` is the real check.
- Reset the form only on success, so a 422 keeps the typed reason.
- Dialog inside a `DropdownMenuContent` unmounts when the menu closes. Lift it out and control `open`.
- Never put the reason in a query string or a toast.
- Same dialog for every module. Pages pass text and action; they never restyle it.
- Typed-name check is UX only, like the 3 chars; the policy and `ReasonRequest` guard the server.

Harvested: 2026-10-08 (dialogs, ReasonRequest from source; typed-name delete, verb routes, placement from standard + rules)
