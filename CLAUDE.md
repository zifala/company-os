# Company OS

tests: none

- Docs site + design system for the Company OS standard. Map: `README.md`.
- Project docs: `~/projects/Products/CompanyOS/app-documentation/` (plans, ADRs). Not in the repo.
- Recipes under `src/docs/content/recipes/` are a mirror of `~/.claude/skills/company-os/`. Change the skill, then `pnpm sync:recipes`. Never edit the mirror.
- Components in `src/components/company-os/`: tokens only, no `@inertiajs` import (seam is `src/lib/navigation.tsx`), props for permissions and request state, copy as props with English defaults, files ≤ 150 lines.
- `src/components/ui/` is vendored shadcn. Keep it skin-neutral; lint ignores it.
- New component = component file + barrel export + `docs/content/entries/<slug>.ts` + category aggregator + demo in `docs/demos/<category>.tsx`. Then `pnpm registry && pnpm llms`.
- Checks: `x-check <files>`; `node scripts/build-registry.mjs && node scripts/build-llms.mjs`; `npx vite build`.
- pnpm, not npm.
