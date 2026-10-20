# React locale translations — specification

`@lilydesignsystem/react-locale-translations` 0.2.0 (2026-10-20). A per-framework copy of `@lilydesignsystem/locale-translations`, so a developer picks the package named for their framework.

1. Every pack is importable as `@lilydesignsystem/react-locale-translations/<locale>` (JSON), all 46 at one level.
2. Each pack states `locale`, `reviewed`, `direction`, `endonym` and `exonyms`.
3. `labelsFor(helper, pack)` returns a ready `labels` for the React helpers (`data-grid`, `kanban-board`, `calendar`, `gantt-chart`, `filter`).
4. The files are byte-identical copies of `shared/` (`bin/sync-shared-modules --check`).
5. Tests: `label-pack.test.ts` build every label from every pack.
