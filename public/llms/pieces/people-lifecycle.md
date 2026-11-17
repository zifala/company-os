# People lifecycle

Rule: people join by invite or generated password, leave by deactivation that hands their work to a successor, and never lose their row; the web stack blocks inactive users, forces a first password change, and demands 2FA for privileged access.

Shape:
- `invitations` table: `name`, `email`, `role_id`, `invited_by`, `token_hash`, `expires_at`, `accepted_at`, `revoked_at`.
- `users`: `deactivated_at`, `must_change_password` (bool). `User::isActive()`, `scopeActive()`.
- `app/Actions/Invitation/SendInvitation.php`, `ResendInvitation.php`, `RevokeInvitation.php`, `AcceptInvitation.php`.
- `app/Actions/User/CreateUserWithPassword.php`, `ChangeOwnPassword.php`, `ChangeUserRole.php`, `DeactivateUser.php`, `ReactivateUser.php`, `HandOverWork.php`.
- Middleware appended to `web`: `EnsureUserIsActive`, `EnsurePasswordChanged`, `EnsureTwoFactorForPrivileged`.
- `UserPolicy`: `viewAny`, `invite`, `update`, `deactivate` → `users.*`.
- Routes: `POST /organization/users/{user}/deactivate`, `/reactivate`, `PATCH .../role` (password confirm), `POST /organization/invitations/{invitation}/resend|revoke`.

Code:

```php
final class DeactivateUser
{
    public const string Unassign = 'unassign';

    public function __construct(private HandOverWork $handOver) {}

    /** @param array{reason: string, successor: string} $data */
    public function handle(User $user, User $actor, array $data): User
    {
        Gate::forUser($actor)->authorize('deactivate', $user);
        $this->guard($user, $actor);
        $successor = $this->successor($user, $data['successor']);

        DB::transaction(function () use ($user, $actor, $data, $successor): void {
            $this->handOver->handle($user, $actor, $successor);
            $user->update(['deactivated_at' => now(), 'remember_token' => null]);
            $user->tokens()->delete();

            activity()->performedOn($user)->causedBy($actor)->event('user.deactivated')
                ->withProperties(['reason' => $data['reason'], 'successor' => $successor?->id])->log('user.deactivated');
        });

        return $user;
    }

    private function successor(User $user, string $choice): ?User
    {
        if ($choice === self::Unassign) {
            return null;
        }

        return (Str::isUuid($choice) ? User::query()->active()->whereKeyNot($user->id)->find($choice) : null)
            ?? throw ValidationException::withMessages(['successor' => __('users.pick_successor')]);
    }
}
```

```php
final class HandOverWork
{
    /** @return array<string, Builder<Model>> */
    public static function queries(User $user): array
    {
        return [
            '<records>' => <Model>::query()->where('owner_id', $user->id)->open(),
        ];
    }

    /** @return array<string, int> */
    public static function counts(User $user): array
    {
        return array_map(fn (Builder $query): int => $query->count(), self::queries($user));
    }

    private function move(Model $record, User $actor, string $column, ?string $to, string $event): void
    {
        $from = $record->getAttribute($column);
        $record->update([$column => $to]);

        activity()->performedOn($record)->causedBy($actor)->event($event)
            ->withProperties(['old' => [$column => $from], 'new' => [$column => $to], 'via' => 'handover'])->log($event);
    }
}
```

```php
class EnsureUserIsActive
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() !== null && ! $request->user()->isActive()) {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login')->with('status', __('users.deactivated_notice'));
        }

        return $next($request);
    }
}
```

```php
class EnsurePasswordChanged
{
    private const array Allowed = ['password.edit', 'user-password.update', 'logout'];

    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()?->must_change_password && ! $request->routeIs(...self::Allowed)) {
            return redirect()->route('password.edit');
        }

        return $next($request);
    }
}
```

- Invitation token: `Str::random(48)` mailed, only `hash('sha256', …)` stored. 7-day expiry. Resend rotates token + expiry. `isPending()` = not accepted, not revoked; `isUsable()` = pending + not expired.
- `SendInvitation` / `CreateUserWithPassword` guard: email free, no pending invite, `AccessGuards::grantable` on the role. Generated password → `must_change_password = true`, shown once via session flash.
- `DeactivateUser::guard`: not super admin, not self, still active. Reason via Form Request, `min:3`.
- `ChangeUserRole`: not self, target not super admin, actor holds target's current role and the new one.
- `EnsureTwoFactorForPrivileged`: workspace flag on + user is super admin or holds any privileged permission + no confirmed 2FA + no passkey → redirect to security. Allow security, 2FA, passkey, password-confirm, password-change, logout routes.
- Fortify `authenticateUsing` also refuses inactive users.
- Audit: `invitation.sent|resent|revoked|accepted`, `user.created` (via, role), `user.password_changed`, `user.role_changed` (from, to), `user.deactivated` (reason, successor), `user.reactivated`, one event per handed-over record.

Test:
- Invitation stored hashed and mailed; accept creates a verified user with the role.
- Expired, revoked or used invitation cannot be accepted. Resend rotates the token.
- Super admin role cannot be invited; stronger role than the actor's refused.
- Generated-password user is redirected to the password page until changed.
- Deactivation needs a reason, keeps the row, hands records to the successor, logs one event per record.
- Successor must be another active user; `unassign` clears owners but is refused while required-owner records exist.
- Super admin and self cannot be deactivated. Deactivated user is logged out on next request and cannot log in.
- Privileged user without 2FA is sent to security while the flag is on; others pass; 2FA routes and logout stay reachable.
- Reactivate clears `deactivated_at`, keeps roles, logs `user.reactivated`; already-active user refused; reactivated user can log in.
- Role change refused on self, on super admin, and for a role the actor does not hold.

Gotchas:
- Deactivate inside one transaction with the handover; revoke API tokens and `remember_token` too.
- Handover moves a record only if the successor may access it; otherwise unassign. Records that require an owner block `unassign`.
- Users page shows `HandOverWork::counts()` so the actor sees what the leaver holds before choosing.
- Never delete users. Reactivate clears `deactivated_at` only; roles stay.
- Privileged permission list is the project's choice; keep it next to the 2FA flag check, not in React.
- Guard messages, flash notices and the invitation mail through `__()`; the mail uses the invitee's locale.

Harvested: 2026-10-08 (all from source; reactivate / role-change tests, mail locale from standard)
