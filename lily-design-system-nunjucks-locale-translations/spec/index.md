# Nunjucks locale translations — specification

`@lilydesignsystem/nunjucks-locale-translations` 0.2.0 (2026-10-20). A per-framework copy of `@lilydesignsystem/locale-translations`, so a developer picks the package named for their framework.

1. Every pack is importable as `@lilydesignsystem/nunjucks-locale-translations/<locale>` (JSON), all 46 at one level.
2. Each pack states `locale`, `reviewed`, `direction`, `endonym` and `exonyms`.
3. `nunjucksLabelsFor(helper, pack)` returns `{ macro, client }`: `macro` is the JSON-safe `labels` for the macro, `client` the same pack as functions for `initX(root, { labels })`; `labelsFor` is exported too.
4. The files are byte-identical copies of `shared/` (`bin/sync-shared-modules --check`).
5. Tests: `label-pack.test.ts` and `label-pack-nunjucks.test.ts` build every label from every pack.
