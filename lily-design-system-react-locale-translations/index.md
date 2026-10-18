# Lily Design System™ React locale translations

`@lilydesignsystem/react-locale-translations` — the strings the React grid-like helpers need, one JSON pack per locale (46), and the loader that turns a pack into a ready `labels` object.

Lily ships no English defaults, so every app used to write and translate about 185 strings per helper itself. A pack is that work done once.

```ts
import { labelsFor } from "@lilydesignsystem/react-locale-translations";
import cy from "@lilydesignsystem/react-locale-translations/cy-001";

<DataGrid label="…" labels={labelsFor("data-grid", cy)} … />
```

`labelsFor(helper, pack)` returns a ready `labels` for the React helpers (`data-grid`, `kanban-board`, `calendar`, `gantt-chart`, `filter`).

## Which package

All eight catalogs have their own package so you install the one that matches your framework: `@lilydesignsystem/{svelte,react,vue,angular,html,web-components,nunjucks}-locale-translations` (npm) and `LilyDesignSystem.Blazor.LocaleTranslations` (NuGet). The packs are identical in every one; the generic `@lilydesignsystem/locale-translations` carries the same files and both loaders for tooling that serves no one framework.

## What a pack holds

The `labels` for each helper, plus `locale`, `reviewed`, `direction`, `endonym` and `exonyms` (the language's name in itself and in each other pack's language; none yet for Bhojpuri). Only English (`en-001`) is reviewed; the other 45 are machine drafts, so check `pack.reviewed` and have a native speaker read one, screen-reader wording especially, before it ships in a product. A key a pack lacks leaves that label unset, never another language. Dates stay out of packs: use `Intl`.

## Source

Edited in the monorepo's `shared/` and copied here by `bin/sync-shared-modules`; never edit a copy. Contract: [spec/label-packs](../spec/label-packs/index.md).
