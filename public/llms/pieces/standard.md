# Company OS standard

What every company operating system gets, whatever the business.
Laravel, security, and UI rules in `~/.claude/rules/` apply on top. Setup comes from `laravel-baseline`.
Each piece has a recipe in `recipes/<slug>.md`. No recipe yet → build from the row, then `/harvest company-os` in a repo that does it well.

## Pieces

| # | Piece | Recipe |
| --- | --- | --- |
| 1 | One Action per verb. Guard, write, audit, notify inside. Thin controllers. | `actions` |
| 2 | Audit: `noun.verb_past`, reason on serious changes, audit log page + CSV. | `audit` |
| 3 | Activity row = event bus for automations and webhooks. | `event-bus` |
| 4 | Permissions: config registry → spatie sync. Roles managed in UI. Grant only what you hold. Super admin via `Gate::before`. Perms shared to Inertia. | `permissions` |
| 5 | Scope per permission: `firm / department / assigned / own`. Sensitive switches per role: money, cost + margin, salaries, contacts. Delegated grants: a manager hands out pages; who + when logged. | `scoped-permissions` |
| 6 | People lifecycle: invite, deactivate with successor + handover, reactivate, forced password change, 2FA for privileged. | `people-lifecycle` |
| 7 | Workspace settings singleton + per-user timezone, quiet hours. Secrets in env; UI shows ok / missing. | `settings` |
| 8 | Setup checklist ticks from real data. Super admin redirected until done. | `setup-checklist` |
| 9 | One-time tour, skips hidden steps, replay `?tour=1`. | `tour` |
| 10 | Notifications: after commit, recipient filter, per-event channel matrix, quiet hours, digest, inbox + bell. | `notifications` |
| 11 | Morning brief, reminders with a sent-ledger, rule signals. | `signals` |
| 12 | Per-user ICS feed. | `calendar-feed` |
| 13 | ⌘K palette (search + actions + go-to), `g`-keys, one global "New". | `command-palette` |
| 14 | Trash: soft delete, 30-day restore, purge job. | `trash` |
| 15 | Saved views, favorites, CSV import with preview, export. | `views-import-export` |
| 16 | Every status change through a confirm / reason dialog. | `status-dialog` |
| 17 | Print / PDF layouts for official documents. | `print-layouts` |
| 18 | Bilingual `lang/en` + `lang/so`, enum labels from lang. Day one. | `bilingual` |
| 19 | Shell: sidebar groups daily → setup, header search + bell, `Settings/` vs `Organization/`. | `shell` |
| 20 | Page kit: PageHeader, FilterBar + DataTable (typed cells) + EmptyState, TabNav, ActionsMenu, ReasonDialog, ActivityTimeline, StatTile, skeleton, load-error. | `page-kit` |
| 21 | Docs system, agent files, CI `ci:check` + audits, Larastan 7. | `docs-ci` |
| 22 | Outbound webhooks: signed endpoints, delivery log + retry, SSRF IP pinning, auto-disable on repeated failure. | `webhooks` |
| 23 | Audit channel: every activity row stamped `via` web / api / automation / agent. | `audit-channel` |
| 24 | Insights inbox: rule signals raise one live insight per kind + scope, dismiss with quiet period, apply suggestion. | `insights` |
| 25 | Setup lists: values a company adds or renames are rows (`list_items`, code + translatable name, deactivate never delete). Enums only where code branches. | `setup-lists` |
| 26 | Section nav: Setup and Organization open a grouped inner sidebar; landing redirects to first permitted page; workspace swaps the sidebar. | `section-nav` |
| 27 | Onboarding: relationship records born only from an approved onboarding. Steps, review, send back, guest link, nested child parties. | `onboarding` |

Avatar, last login, packages, Redis, security setup → `laravel-baseline`, not here.

## Placement

- Sidebar groups ordered daily → setup. Items permission-gated. Empty group hidden.
- Header: search + bell on the right. No create button up top.
- Page header owns its "+ Create". Nothing above the title.
- Personal `Settings/` only for the user's own things. Platform config in `Organization/`, reached from the sidebar.
- Empty state names the first action.

## Never travels

- Product modules, their permission lists, starter templates, home sections.
- Look: each project owns palette, fonts, brand. No glow — `signature.md` wins over any skin.
