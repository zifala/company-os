# Docs and CI

Rule: `docs/` holds the why in caveman files written with the code; one `composer ci:check` runs every gate locally and in CI, Larastan at level 7, dependency audits included.

Shape:
- `docs/README.md` — folder table, flow, "Now" (where to start, current release, open plans).
- `docs/domain/` — what the product is: `overview.md` (modules, glossary), boundaries.
- `docs/features/<module>.md` — what it does, rules, `Status: shipped YYYY-MM-DD`.
- `docs/business-logic/<domain>.md` — states, transitions by Action name, guards, audit events. Tables.
- `docs/plans/` — goal, scope in / out, steps, done-when. Deleted once folded into `features/`.
- `docs/adr/NNNN-title.md` — Status, Context, Decision, Consequences. Supersede, never rewrite.
- `docs/design/` — project look only: `palette.md`, `type.md`, `ui-rules.md`, `screens/`.
- `docs/ideas/`, `docs/audits/YYYY-MM-DD-topic.md` (findings worst first + fix list).
- `AGENTS.md` — generated agent guidelines (Laravel Boost). `CLAUDE.md` = `@AGENTS.md` + project flags (`tests: write`).
- `phpstan.neon`, `.github/workflows/tests.yml`, `.github/dependabot.yml`.

Code:

```markdown
| Folder | Holds |
| --- | --- |
| `domain/` | What the product is. Concepts, boundaries, glossary. |
| `features/` | One file per product area. What it does, rules, status. |
| `business-logic/` | One file per domain. States, transitions, guards, audit events. |
| `design/` | Project look. Palette, type, ui rules, screens. |
| `plans/` | Work to build. Goal, scope, steps, done-when. |
| `adr/` | Decisions. `NNNN-title.md`. Supersede, never rewrite. |
| `ideas/` | Raw, unapproved ideas. |
| `audits/` | `YYYY-MM-DD-topic.md`. |

## Flow

- Idea → `ideas/`. Approved → `plans/`. Shipped → fold into `features/`, delete plan.
- Decision made or reversed → new ADR.
```

```markdown
## Restore

| Action | Event | Guard |
| --- | --- | --- |
| `Restore<Model>` | `<model>.restored` | `delete` on <model>. In trash. Deleted ≤ 30 days ago |
```

```json
"scripts": {
    "lint:check": ["pint --parallel --test"],
    "types:check": ["phpstan analyse"],
    "test": ["@php artisan config:clear --ansi", "@lint:check", "@types:check", "@php artisan test"],
    "audit": ["composer audit --locked", "npm audit --audit-level=high"],
    "ci:check": ["Composer\\Config::disableProcessTimeout", "npm run check", "npm run types:check", "@audit", "@test"]
}
```

```neon
includes:
    - vendor/larastan/larastan/extension.neon
    - vendor/nesbot/carbon/extension.neon

parameters:
    paths:
        - app/
        - bootstrap/app.php
        - config/
        - database/
        - routes/
    scanFiles:
        - tests/Pest.php
    level: 7
```

```yaml
on:
  push:
    branches: [main]
  pull_request:

permissions:
  contents: read

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@<sha>
        with:
          persist-credentials: false
      - uses: shivammathur/setup-php@<sha>
        with:
          php-version: '8.4'
          tools: composer:v2
          coverage: none
      - uses: actions/setup-node@<sha>
        with:
          node-version: '22'
      - run: composer setup
      - run: composer ci:check
```

- `npm run check` = the front-end lint + format check; `npm run types:check` = `tsc --noEmit`.
- `composer setup` = install, copy `.env.example`, `key:generate`, `migrate --force`, `npm install`, `npm run build`. Same command for a new laptop and CI.
- Dependabot: `github-actions` weekly with a cooldown, grouped; add `composer` and `npm` ecosystems the same way.

Test:
- `composer ci:check` passes locally before every push; CI runs the exact same script, nothing extra hidden in YAML.
- Larastan baseline file absent or shrinking; never raise it to pass.
- A feature change without its `docs/business-logic` or `docs/features` update fails review (`signature`).
- Remove a key from `lang/so/*.php` → the parity test fails; a known advisory in `composer.lock` → `composer audit` fails `ci:check`.

Gotchas:
- Actions pinned by commit SHA with the version in a comment; `permissions: contents: read`; `persist-credentials: false`.
- `composer audit` and `npm audit --audit-level=high` belong inside `ci:check`, not as a separate optional job.
- `CLAUDE.md` stays tiny: import `AGENTS.md`, add flags. Boost regenerates `AGENTS.md`; hand rules go in `.ai/rules/`.
- `docs/README.md` "Now" section is the entry point for the next agent: keep it current in the same change.
- Business logic docs name Actions and events, not controllers or UI.
- Production on Postgres → CI tests on Postgres too (a `postgres` service + `DB_CONNECTION=pgsql`). SQLite passes queries Postgres rejects (uuid vs int morphs, `ilike`, strict grouping).
- `lang/en` and `lang/so` key parity is a test in the suite, so `ci:check` fails on a missing translation.
- Every other major version: delete shipped plans, dead ideas, stale audits; collapse superseded ADRs to one line each in `adr/README.md`.

Harvested: 2026-10-08 (docs map, ci:check, Larastan 7, workflow from source; design/ folder, Postgres job, lang parity, cleanup from standard + rules)
