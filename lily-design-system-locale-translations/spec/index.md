# Locale translations — specification

`@lilydesignsystem/locale-translations` 0.1.0 (2026-10-18). The label packs and loaders, published.

## 1. Goal

Let an app use the grid-like helpers in a language without writing the strings itself.

## 2. Scope

In: the 46 packs, `labelsFor`, `nunjucksLabelsFor`, their types. Out: weekday and month names, period titles (use `Intl`); the Blazor loader (`LabelPack` in the Blazor packages); any translation workflow.

## 3. Contract

3.1 Each pack is importable as `@lilydesignsystem/locale-translations/<locale>` (JSON), all 46 at one level, with no drafts path.
3.2 Each pack states `locale`, `reviewed`, `direction`, `endonym` and `exonyms` (the language named in each other pack's language, from `locales.tsv`; none for Bhojpuri, whose column is empty there); only `en-001` is `true` until a native speaker reviews another.
3.3 `labelsFor(helper, pack)` and `nunjucksLabelsFor(helper, pack)` behave as in [shared/label-packs](../../shared/label-packs/index.md).
3.4 The files here are byte-identical copies of `shared/` (`bin/sync-shared-modules --check`).

## 4. Tests

`label-pack.test.ts` builds every label from every pack; `label-pack-nunjucks.test.ts` renders every Nunjucks form. Both are copies of the `shared/` tests.
