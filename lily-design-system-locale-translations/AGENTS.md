# AGENTS — Locale labels

Single source of truth: [spec/index.md](./spec/index.md).

## What this package is

The 64 per-locale label packs (`label-packs/<locale>.json`) and their loaders (`label-pack.ts`, `label-pack-nunjucks.ts`), published as `@lilydesignsystem/locale-translations`. No dependencies, no CSS, no English default.

## Rules to keep

- Edit `shared/` (packs and loaders), then run `bin/sync-shared-modules`; never edit a copy here. `--check` runs in `bin/test`.
- Packs are flat exports (`@lilydesignsystem/locale-translations/cy-001`); there is no separate drafts path. The `reviewed` flag in each pack is the only signal, so say so when you ship an unreviewed one.
- A new string: `en-001` first, then every locale, then `bin/check-label-packs`.

## Verify

`pnpm test`, `pnpm run build`, `npm pack --dry-run`, and `bin/test` from the monorepo root.
