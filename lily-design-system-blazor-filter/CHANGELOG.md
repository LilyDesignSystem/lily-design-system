# Changelog — Filter (Blazor)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.3.0 — 2026-11-24

- **Added:** a summary line and a remove-all button (tasks.md P40-T10): `FilterLabels.Summary`, `ClearAll` and `AllRemoved`, from `ToFilterLabels()` too; `FilterModel.ClearFilter`.

## 0.2.0 — 2026-11-24

- `ToFilterLabels()` builds `FilterLabels` from a label pack.

## 0.1.0 — 2026-10-17

- First release, ported from the Svelte `svelte-filter` 0.1.0: `FilterBuilder`, a headless filter builder (conditions and groups over text, number, date, choice and yes/no fields; upper and lower limits, ranges, lists, empty checks; and / or / not; nesting to `maxDepth`; `readonly`).
- Output as JSON (`toJson`, `fromJson`), SQL (`toSql`: parameterised, `ansi`, `postgres`, `mysql`, `sqlite`, `mssql`, identifier allow-list, escaped `LIKE`, `inline` for display), MongoDB (`toMongo`), OData (`toOData`) and a predicate (`toPredicate`); `formatFilter` for display.
- Incomplete conditions are shown but left out of every output until finished.
- The pure model comes from `shared/filter-model.ts` (`bin/sync-shared-modules`).
