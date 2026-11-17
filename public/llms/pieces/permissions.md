# Permissions

Rule: permissions live in one config registry, a command syncs them into spatie; roles are built in the UI; nobody grants what they do not hold; super admin passes everything via `Gate::before`.

Shape:
- `config/permissions.php` — `'<module>' => ['<action>' => 'permissions.<module>.<action>']`. Name = `<module>.<action>`, kebab actions (`view-any`, `create`, `update`, `delete`, `manage`).
- `lang/en/permissions.php`, `lang/so/permissions.php` — the labels.
- `app/Models/Role.php` extends spatie Role, `const string SuperAdmin`, `isSuperAdmin()`. `app/Models/Permission.php` extends spatie Permission.
- `app/Actions/Permission/SyncPermissions.php` + `permissions:sync` command (prints added / removed).
- `app/Actions/Role/CreateRole.php`, `UpdateRole.php`, `DeleteRole.php`. `RolePolicy` → `roles.manage`.
- `app/Actions/User/AccessGuards.php` — `holdsRole`, `grantable`, `permissions`. Used by role, invite and role-change Actions.
- `HandleInertiaRequests::share()` → `auth.permissions` (string list) + `auth.isSuperAdmin`.
- Routes under `Organization/roles`, writes behind `password.confirm`.

Code:

```php
final class SyncPermissions
{
    /** @return array{added: list<string>, removed: list<string>} */
    public function handle(): array
    {
        $configured = self::configuredNames();

        return DB::transaction(function () use ($configured): array {
            $existing = Permission::query()->where('guard_name', 'web')->pluck('name')->all();
            $added = array_values(array_diff($configured, $existing));
            $removed = array_values(array_diff($existing, $configured));

            foreach ($added as $name) {
                Permission::create(['name' => $name, 'guard_name' => 'web']);
            }

            Permission::query()->whereIn('name', $removed)->where('guard_name', 'web')->delete();
            app(PermissionRegistrar::class)->forgetCachedPermissions();
            Role::findOrCreate(Role::SuperAdmin, 'web')->syncPermissions($configured);

            activity()->event('permissions.synced')->withProperties(['added' => $added, 'removed' => $removed])->log('permissions.synced');

            return ['added' => $added, 'removed' => $removed];
        });
    }

    /** @return list<string> */
    public static function configuredNames(): array
    {
        return collect(config('permissions'))
            ->flatMap(fn (array $actions, string $module) => array_map(fn (string $action) => "{$module}.{$action}", array_keys($actions)))
            ->values()->all();
    }
}
```

```php
final class AccessGuards
{
    public static function holdsRole(User $actor, Role $role): bool
    {
        return $actor->isSuperAdmin() || self::missing($actor, $role->permissions->pluck('name')->all()) === [];
    }

    public static function grantable(User $actor, Role $role): void
    {
        if ($role->isSuperAdmin() || ! self::holdsRole($actor, $role)) {
            throw ValidationException::withMessages(['role_id' => __('access.role_not_grantable', ['role' => $role->name])]);
        }
    }

    /** @param list<string> $permissions */
    public static function permissions(User $actor, array $permissions): void
    {
        $missing = $actor->isSuperAdmin() ? [] : self::missing($actor, $permissions);

        if ($missing !== []) {
            throw ValidationException::withMessages(['permissions' => __('access.cannot_grant', ['list' => implode(', ', $missing)])]);
        }
    }

    /**
     * @param  list<string>  $permissions
     * @return list<string>
     */
    private static function missing(User $actor, array $permissions): array
    {
        return array_values(array_diff($permissions, $actor->getAllPermissions()->pluck('name')->all()));
    }
}
```

```php
$before = $role->permissions->pluck('name')->all();
$granted = array_values(array_diff($data['permissions'], $before));
AccessGuards::permissions($actor, $granted);
```

```php
Gate::before(fn (User $user): ?bool => $user->isSuperAdmin() ? true : null);
```

```php
'permissions' => $user->isSuperAdmin()
    ? SyncPermissions::configuredNames()
    : $user->getAllPermissions()->pluck('name')->values()->all(),
```

- `UpdateRole` guards only newly granted names, so a partial holder can still rename a role or drop permissions.
- Audit: `role.created` (permissions), `role.updated` (old / new name, granted, revoked), `role.deleted` (name, reason).
- Super admin role is locked: no edit, no delete, never granted, never assigned via UI. Created only by a command.
- `DeleteRole`: refuse while users hold it; reason required.
- Role form groups come from the config, labels from lang. React filters sidebar items with `auth.permissions`; it never decides access.

Test:
- Sync adds new config names, deletes removed ones, super admin holds every permission.
- Create / update refuses permissions the actor lacks; names the missing ones. Super admin can grant any.
- Update keeps existing permissions the actor lacks; only new grants are checked.
- Super admin role cannot be edited, deleted or granted.
- Role in use cannot be deleted; delete logs the reason.
- Role routes redirect to `password.confirm` without a fresh confirm.
- No `roles.manage` → 403.
- Shared `auth.permissions` lists exactly the held names; super admin gets the full config list before any sync.

Gotchas:
- Run `permissions:sync` in deploy and in the first-admin command. Removing a key deletes the permission from every role.
- Call `forgetCachedPermissions()` after sync or tests see stale names.
- Share names to Inertia, not spatie models. Super admin has no direct rows if sync never ran, so share the config list.
- `Gate::before` returning `false` blocks everyone; return `null` to fall through. Product-specific exceptions (e.g. writes on a closed record) go inside it, not in every policy.
- Labels in `config` are lang keys, never English strings.

Harvested: 2026-10-08 (all from source; shared-props test from standard)
