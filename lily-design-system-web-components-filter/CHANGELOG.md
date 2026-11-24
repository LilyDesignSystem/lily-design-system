# Changelog — Filter (Web Components)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## Unreleased

- **Added:** a summary line and a remove-all button (tasks.md P40-T10). `labels.summary(count)` shows `p.filter-summary` above the builder ("Conditions: 3"); `labels.clearAll` shows `button.filter-clear-all`, which removes every condition and group and the top level's _Not_, keeps its _and_ / _or_, announces `labels.allRemoved`, and moves focus to _Add condition_. It is hidden when there is nothing to remove and when `readonly`. The model gains `clearFilter`. The 64 label packs carry all three (`summary` as a `{count}` template).
- **Added:** a `partial-date` field type (a year, a month or a day), compared three-valued: a comparison its precision cannot decide matches neither the rule nor its negation, in the predicate and every output (spec/lessons/openehr-rust item 5).

## 0.1.0 — 2026-10-17

- First release, ported from the Svelte `svelte-filter` 0.1.0: `<lily-filter-builder>`, a headless filter builder (conditions and groups over text, number, date, choice and yes/no fields; upper and lower limits, ranges, lists, empty checks; and / or / not; nesting to `maxDepth`; `readonly`).
- Output as JSON (`toJson`, `fromJson`), SQL (`toSql`: parameterised, `ansi`, `postgres`, `mysql`, `sqlite`, `mssql`, identifier allow-list, escaped `LIKE`, `inline` for display), MongoDB (`toMongo`), OData (`toOData`) and a predicate (`toPredicate`); `formatFilter` for display.
- Incomplete conditions are shown but left out of every output until finished.
- The pure model comes from `shared/filter-model.ts` (`bin/sync-shared-modules`).
