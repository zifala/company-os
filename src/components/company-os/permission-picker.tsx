import { LockIcon } from 'lucide-react';
import { useId } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { OptionSelect } from '@/components/ui/option-select';
import { cn } from '@/lib/utils';

export type PermissionOption = {
    name: string;
    label: string;
    scoped?: boolean;
};

export type PermissionGroup = {
    key: string;
    label: string;
    permissions: PermissionOption[];
};

export type ScopeOption = { value: string; label: string };

export type PermissionGrant = { name: string; scope: string | null };

export type PermissionPickerLabels = { selectAll: string; scope: string; notHeld: string; selected: (count: number, total: number) => string };

export const permissionPickerLabels: PermissionPickerLabels = {
    selectAll: 'Select all',
    scope: 'Scope',
    notHeld: 'You do not hold this permission',
    selected: (count, total) => `${count} of ${total}`,
};

function Row({
    id,
    permission,
    grant,
    scopes,
    locked,
    labels,
    onToggle,
    onScope,
}: {
    id: string;
    permission: PermissionOption;
    grant: PermissionGrant | undefined;
    scopes: ScopeOption[];
    locked: boolean;
    labels: PermissionPickerLabels;
    onToggle: (checked: boolean) => void;
    onScope: (scope: string) => void;
}) {
    return (
        <li className="flex min-h-12 flex-wrap items-center gap-3 border-b border-border px-5 py-2 last:border-0">
            <Checkbox id={id} checked={grant !== undefined} disabled={locked} aria-describedby={locked ? `${id}-locked` : undefined} onCheckedChange={(checked) => onToggle(checked === true)} />
            <label htmlFor={id} className={cn('min-w-0 flex-1 text-sm text-foreground', locked && 'text-muted-foreground')}>
                {permission.label}
                <span className="ms-2 font-mono text-xs text-muted-foreground">{permission.name}</span>
            </label>
            {locked && (
                <span id={`${id}-locked`} title={labels.notHeld} className="inline-flex">
                    <LockIcon className="size-3.5 text-muted-foreground" aria-hidden />
                    <span className="sr-only">{labels.notHeld}</span>
                </span>
            )}
            {permission.scoped && grant && (
                <OptionSelect aria-label={`${labels.scope}: ${permission.label}`} className="w-40" value={grant.scope ?? scopes[0]?.value} options={scopes} disabled={locked} onValueChange={onScope} />
            )}
        </li>
    );
}

export function PermissionPicker({
    groups,
    value,
    onChange,
    scopes,
    holds,
    disabled = false,
    labels = permissionPickerLabels,
}: {
    groups: PermissionGroup[];
    value: PermissionGrant[];
    onChange: (value: PermissionGrant[]) => void;
    scopes: ScopeOption[];
    holds: (name: string) => boolean;
    disabled?: boolean;
    labels?: PermissionPickerLabels;
}) {
    const uid = useId();
    const byName = new Map(value.map((grant) => [grant.name, grant]));
    const defaultScope = scopes[0]?.value ?? null;
    const locked = (name: string) => disabled || (!holds(name) && !byName.has(name));

    const set = (permission: PermissionOption, checked: boolean) =>
        onChange(checked ? [...value, { name: permission.name, scope: permission.scoped ? defaultScope : null }] : value.filter((grant) => grant.name !== permission.name));

    const setScope = (name: string, scope: string) => onChange(value.map((grant) => (grant.name === name ? { ...grant, scope } : grant)));

    const setGroup = (group: PermissionGroup, checked: boolean) => {
        const open = group.permissions.filter((permission) => !locked(permission.name));
        const names = new Set(open.map((permission) => permission.name));
        const kept = value.filter((grant) => !names.has(grant.name));
        onChange(checked ? [...kept, ...open.map((permission) => byName.get(permission.name) ?? { name: permission.name, scope: permission.scoped ? defaultScope : null })] : kept);
    };

    return (
        <div className="grid gap-6">
            {groups.map((group) => {
                const count = group.permissions.filter((permission) => byName.has(permission.name)).length;
                const open = group.permissions.filter((permission) => !locked(permission.name));
                // Toggle against what the editor can change: once every open permission is ticked, the next click clears them,
                // even when a locked one keeps the box indeterminate.
                const allOpen = open.length > 0 && open.every((permission) => byName.has(permission.name));

                return (
                    <section key={group.key} className="rounded-lg glass">
                        <div className="flex items-center gap-3 border-b border-border px-5 py-3">
                            <Checkbox
                                id={`${uid}-group-${group.key}`}
                                aria-label={`${labels.selectAll}: ${group.label}`}
                                checked={count === 0 ? false : count === group.permissions.length ? true : 'indeterminate'}
                                disabled={open.length === 0}
                                onCheckedChange={() => setGroup(group, !allOpen)}
                            />
                            <h3 className="flex-1 text-sm font-semibold text-foreground">{group.label}</h3>
                            <span className="text-xs tabular-nums text-muted-foreground">{labels.selected(count, group.permissions.length)}</span>
                        </div>
                        <ul>
                            {group.permissions.map((permission) => (
                                <Row
                                    key={permission.name}
                                    id={`${uid}-${permission.name}`}
                                    permission={permission}
                                    grant={byName.get(permission.name)}
                                    scopes={scopes}
                                    locked={locked(permission.name)}
                                    labels={labels}
                                    onToggle={(checked) => set(permission, checked)}
                                    onScope={(scope) => setScope(permission.name, scope)}
                                />
                            ))}
                        </ul>
                    </section>
                );
            })}
        </div>
    );
}
