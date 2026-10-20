# Lily Design System™ locale translations

`@lilydesignsystem/locale-translations` — the strings the grid-like helpers need (`data-grid`, `kanban-board`, `calendar`, `gantt-chart`, `filter`), one JSON pack per locale, and the loaders that turn a pack into a ready `labels` object.

Lily ships no English defaults, so every app used to write and translate about 185 strings per helper itself. A pack is that work done once.

```ts
import { labelsFor } from "@lilydesignsystem/locale-translations";
import cy from "@lilydesignsystem/locale-translations/cy-001";

<DataGrid label="…" labels={labelsFor("data-grid", cy)} … />
```

Most developers should install the package named for their framework — `@lilydesignsystem/{svelte,react,vue,angular,html,web-components,nunjucks}-locale-translations` (npm) or `LilyDesignSystem.Blazor.LocaleTranslations` (NuGet). They hold the same packs; this generic package carries both loaders and suits tooling that serves no single framework.

## What is in it

| Export | What it is |
| ------ | ---------- |
| `@lilydesignsystem/locale-translations/<locale>` | One pack, e.g. `en-001`, `cy-001`, `ta-001`. 64 locales, all at the same level. |
| `labelsFor(helper, pack)` | A ready `labels` for the Svelte, React, Vue, Angular, HTML and Web Components helpers. |
| `nunjucksLabelsFor(helper, pack)` | `{ macro, client }` for the Nunjucks macros and clients. |
| `pack.endonym`, `pack.exonyms`, `pack.direction` | The language's name in itself (`Cymraeg`), its name in each other pack's language (`exonyms["en-001"]` is `Welsh`), and `ltr` / `rtl`. Enough to list every language in its own and the reader's language, as a locale picker does. Bhojpuri has no exonyms yet. From `locales.tsv`. |
| `LabelPack`, `LabelHelper`, `SPEC`, `fillTemplate` | Types and the template contract. |

## Reviewed or not

Every pack carries `"reviewed": true | false`. Only English (`en-001`) is reviewed. The other 63 are machine drafts that no native speaker has read; check `pack.reviewed` and have a native speaker read a pack, screen-reader wording especially, before it ships in a product. A key a pack lacks leaves that label unset, never another language. Dates stay out of packs: use `Intl`.

## Source

The packs and loaders are edited in the monorepo's `shared/` directory and copied here by `bin/sync-shared-modules`; never edit a copy. Full contract: [shared/label-packs/index.md](../shared/label-packs/index.md) and [spec/label-packs](../spec/label-packs/index.md).
