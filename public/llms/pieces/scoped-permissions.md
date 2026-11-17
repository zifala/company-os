# Scoped permissions

Rule: a permission says what; a scope says over which records; switches hide sensitive fields; grants add pages per person.

Shape:
- `app/Enums/Scope.php` — `Firm`, `Department`, `Assigned`, `Own`.
- `app/Enums/Sensitive.php` — `Money`, `CostAndMargin`, `Salaries`, `ClientContacts`.
- `role_scopes` table: `role_id`, `permission`, `scope`.
- `role_sensitive` table: `role_id`, `switch`, `allowed`.
- `grants` table: `user_id`, `page`, `granted_by`, `granted_at`, `revoked_at`.
- `app/Support/Access.php` — one read model all policies call.
- Model scope `scopeVisibleTo(Builder, User)` on every scoped model.
- `Assigned` on a container record (`<Model>` that holds others) = membership: `<model>_members` table `<model>_id`, `user_id`, `role` (`app/Enums/<Model>Role.php`: `Manager`, `Editor`, `Viewer`). `User::roleIn(<Model>): ?<Model>Role`.

Code:

```php
final class Access
{
    public static function scope(User $user, string $permission): ?Scope
    {
        return $user->roles
            ->flatMap->scopes
            ->where('permission', $permission)
            ->map(fn (RoleScope $row) => $row->scope)
            ->sortBy(fn (Scope $scope) => $scope->rank())
            ->first();
    }

    public static function sees(User $user, Sensitive $switch): bool
    {
        return $user->roles->flatMap->sensitive
            ->contains(fn (RoleSensitive $row) => $row->switch === $switch && $row->allowed);
    }

    public static function granted(User $user, string $page): bool
    {
        return $user->grants()->where('page', $page)->whereNull('revoked_at')->exists();
    }
}
```

```php
public function scopeVisibleTo(Builder $query, User $user): Builder
{
    return match (Access::scope($user, '<module>.view')) {
        Scope::Firm => $query,
        Scope::Department => $query->whereIn('department_id', $user->departmentIds()),
        Scope::Assigned => $query->whereHas('members', fn (Builder $q) => $q->where('user_id', $user->id)),
        Scope::Own => $query->where('created_by', $user->id),
        null => $query->whereRaw('false'),
    };
}
```

```php
enum <Model>Role: string
{
    case Manager = 'manager';
    case Editor = 'editor';
    case Viewer = 'viewer';

    public function canWork(): bool
    {
        return $this !== self::Viewer;
    }

    public function canManage(): bool
    {
        return $this === self::Manager;
    }
}
```

```php
public function update(User $user, <Model> $record): bool
{
    return $user->can('<module>.update') || (bool) $user->roleIn($record)?->canManage();
}
```

```php
public function scopeVisibleTo(Builder $query, User $user): void
{
    if ($user->can('<child>.view-any')) {
        return;
    }

    $query->whereHas('<parent>', fn (Builder $parent) => $parent->visibleTo($user));
}
```

- Policy order: super admin (`Gate::before`) → firm-wide permission → membership role on the record → deny.
- Membership role abilities are fixed in the enum, not configurable. Manager: edit + manage members + read sensitive tab. Editor: work. Viewer: read.
- Child records follow the parent's `visibleTo`. Records without a parent fall back to creator / assignee.
- Last manager cannot leave or step down. Removing a member unassigns their open child records in that container.
- `Scope::rank()`: Firm 0, Department 1, Assigned 2, Own 3. Widest wins.
- Resources drop sensitive fields server-side: `'cost' => $this->when(Access::sees($user, Sensitive::CostAndMargin), $this->cost)`.
- Share to Inertia: `can` map, `sees` map, granted pages. React only reads them.
- Grant and revoke are Actions: `GrantPage`, `RevokePage`. Granter must hold the page. Audit `grant.given`, `grant.revoked`.
- Member changes are Actions: `Add<Model>Member`, `Change<Model>MemberRole`, `Remove<Model>Member`. Audit `<model>.member_added|member_role_changed|member_removed`.

Test:
- Department scope lists only own-department records.
- No scope row → empty list, 404 on show.
- Firm-wide permission sees every container; members see only theirs.
- Each membership role grants exactly its fixed abilities (dataset over Manager / Editor / Viewer).
- Child record visible only through a visible parent.
- Cost hidden in JSON without the switch.
- Director grants a page they hold; cannot grant one they lack.
- Revoked grant removes the sidebar item and returns 403.
- Super admin with no scope rows sees every record and every sensitive field.

Gotchas:
- Every index and every show goes through `visibleTo`. A show that skips it leaks by ID.
- Exports, search, API and agent tools use the same scope. Not visible → 404 / `not_found`, never 403, so IDs do not leak.
- Never hide sensitive fields only in React.
- Load `memberships` once per request; `roleIn` reads the loaded collection, not a query per check.
- Assigning a child record: assignee must pass `work` on the container. Viewers cannot be assigned.
- `Gate::before` does not reach `Access`. Super admin short-circuits in `scope()` (→ `Firm`) and `sees()` (→ `true`), or super admin loses money columns.
- `Scope`, `Sensitive` and `<Model>Role` `label()` read `__("enums.<enum>.{$this->value}")`; the role editor shows labels, never raw values.

Harvested: 2026-10-08 (scope, switches, grants from concept; membership roles and child visibility from source; super admin short-circuit, enum labels from standard)
