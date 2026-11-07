# Company OS

The standard every company operating system gets, and the React components that ship it. Guide, component library, shadcn-compatible registry, `llms.txt`.

The standard travels. The look stays home: components use semantic tokens only, so each product keeps its own palette, radius and fonts.

## What's inside

```
src/
  styles/tokens.css            the required token set (shadcn + success, warning, info, field). Site values; the only file with colour literals
  styles/app.css               tailwind + tokens + base
  lib/navigation.tsx           the ONE seam: Link · useCurrentUrl · navigate · reload (react-router here)
  lib/utils.ts                 cn
  components/ui/               shadcn primitives (vendored, de-skinned to tokens)
  components/company-os/       the library — one file per component, barrel in index.ts
  blocks/ · templates/         compositions of the library
  docs/content/                pure-data doc entries → site + markdown + registry
  docs/content/recipes/        the standard + 27 recipes, mirrored from the company-os skill
  docs/demos/                  live previews per category
  docs/site/                   the site: shell, search, pages
registry/adapters/
  navigation.inertia.tsx       the Inertia version of lib/navigation.tsx; what the registry ships
scripts/
  sync-recipes.mjs             copy standard + recipes from ~/.claude/skills/company-os
  check-sync.mjs               fail on drift between skill and mirror
  build-registry.mjs           public/r/*.json
  build-llms.mjs               public/llms.txt + public/llms/*.md
```

## Commands

```bash
pnpm install
pnpm dev             # site at localhost:5173
pnpm build           # registry + llms + typecheck + site → dist/
pnpm registry        # public/r only
pnpm llms            # public/llms only
pnpm sync:recipes    # refresh the recipe mirror from the skill
pnpm check:sync      # drift check
REGISTRY_BASE=https://your.domain pnpm build
```

## Consuming (shadcn model)

In a Laravel + Inertia React project with shadcn set up:

```bash
npx shadcn@latest add https://your.domain/r/data-table.json
```

Installs the component source, the token set (`tokens.css` as a sample to merge into `app.css`), `lib/utils.ts`, and `lib/navigation.tsx` (the Inertia adapter). You own the code from there.

Required tokens beyond shadcn's: `--success`, `--warning`, `--info`, `--field`. Map them in `@theme inline` like the others.

## Rules the components follow

- Semantic tokens only. No palette literals outside `styles/tokens.css` and `components/ui/`.
- No Inertia import outside `registry/adapters/`. Permissions, processing, errors arrive as props.
- Nothing above a page title. Lists are tables. Every cell typed. Empty keeps the table.
- Every status change through a confirm or reason dialog.
- Navigation is data: one list drives the sidebar, the landing redirect and the palette.

## Docs

The standard and its recipes live in the `company-os` skill. This repo mirrors them (`pnpm sync:recipes`) and never edits the mirror. Project docs (plans, ADRs) live in `~/projects/Products/CompanyOS/app-documentation/`.
