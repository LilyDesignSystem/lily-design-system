# AGENTS — Nunjucks locale translations

Single source of truth: [spec/index.md](./spec/index.md). The 46 packs (`label-packs/<locale>.json`) and the loader (`label-pack.ts`, `label-pack-nunjucks.ts`), published as `@lilydesignsystem/nunjucks-locale-translations`. Edit `shared/`, run `bin/sync-shared-modules`; never edit a copy. Packs are flat exports; the `reviewed` flag marks a draft. Verify: `pnpm test`, `pnpm run build`, `bin/test`.
