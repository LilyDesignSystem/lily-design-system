# Label packs

The strings a grid-like helper's `labels` object needs, one file per locale: `data-grid`, `kanban-board`, `calendar`,
`gantt-chart` and `filter`, about 185 strings each. Lily ships no English defaults, so every app used to write and translate
these itself; a pack is that work done once.

```ts
import { labelsFor } from "./label-pack"; // shared/label-pack.ts, single-sourced like the other shared modules
import ta from "./label-packs/ta-001.json";

<DataGrid label="…" labels={labelsFor("data-grid", ta)} … />
```

`labelsFor(helper, pack)` returns plain strings as they are and builds the function labels (`pageStatus`, `moveAnnouncement`, …)
from `{placeholder}` templates. Where wording depends on a value (ascending / descending, collapsed / expanded, the calendar view,
the dependency type, the filter operator) the pack holds an object keyed by that value.

## Not in a pack

Anything that depends on how a locale writes dates is left to `Intl`: weekday names, the calendar's `day`, `periodTitle`,
`periodAnnouncement` and `rangeAnnouncement`, the Gantt `columnLabel`, and the date-time-picker labels. A key a pack lacks is left
out, so the control stays unnamed (and says so in development) rather than showing text from another language.

## Locales

| Locale | Language | Reviewed |
| ------ | -------- | -------- |
| `ar-001` | Arabic (right to left) | no |
| `bg-001` | Bulgarian | no |
| `bh-001` | Bhojpuri | no |
| `bn-001` | Bengali | no |
| `cs-001` | Czech | no |
| `cy-001` | Welsh | no |
| `da-001` | Danish | no |
| `de-001` | German | no |
| `el-001` | Greek | no |
| `en-001` | English (the base) | yes |
| `es-001` | Spanish | no |
| `et-001` | Estonian | no |
| `eu-001` | Basque | no |
| `fa-001` | Persian (right to left) | no |
| `fi-001` | Finnish | no |
| `fr-001` | French | no |
| `ga-001` | Irish | no |
| `gu-001` | Gujarati | no |
| `ha-001` | Hausa | no |
| `hi-001` | Hindi | no |
| `hr-001` | Croatian | no |
| `hu-001` | Hungarian | no |
| `id-001` | Indonesian | no |
| `it-001` | Italian | no |
| `ja-001` | Japanese | no |
| `jv-001` | Javanese | no |
| `ko-001` | Korean | no |
| `lt-001` | Lithuanian | no |
| `lv-001` | Latvian | no |
| `mr-001` | Marathi | no |
| `mt-001` | Maltese | no |
| `nl-001` | Dutch | no |
| `pa-001` | Punjabi (Gurmukhi) | no |
| `pl-001` | Polish | no |
| `pt-001` | Portuguese | no |
| `ro-001` | Romanian | no |
| `ru-001` | Russian | no |
| `sk-001` | Slovak | no |
| `sl-001` | Slovenian | no |
| `sv-001` | Swedish | no |
| `ta-001` | Tamil | no |
| `te-001` | Telugu | no |
| `tr-001` | Turkish | no |
| `ur-001` | Urdu (right to left) | no |
| `vi-001` | Vietnamese | no |
| `zh-001` | Chinese | no |

**Every pack except English is an unreviewed machine draft** (45 of them), including Welsh, whose strings no Welsh speaker has checked. A `"reviewed": false` pack should be read by a native speaker
before it ships in a product; flip the flag only when one has. Bhojpuri has no ISO 639-1 code (`bh` is deprecated; the language is
`bho`), so `bh-001` follows the requested tag. Terminology is a first pass, and screen-reader wording in particular deserves
review.

## Which frameworks they fit (checked 2026-10-18)

| Catalog | How a pack becomes `labels` |
| ------- | --------------------------- |
| Svelte, React, Vue, Angular, HTML, Web Components | **Directly.** The same label keys, the same argument count and order, the same union values (`four-week`, `e2s`, `ascending`) and the same object fields (`card.title`, `task.label`): `labelsFor(helper, pack)` is a drop-in `labels`. `bin/check-label-packs` keeps this true. |
| Nunjucks | **Through `nunjucksLabelsFor(helper, pack)`** (`shared/label-pack-nunjucks.ts`). A macro cannot take a function and the Nunjucks helpers use their own `{token}` names and split two-state labels in two (`collapseLabel` / `expandLabel`), so it returns `{ macro, client }`: `macro` is the JSON-safe `labels` for the macro, `client` the same pack as functions for `initX(root, { labels })`. Each Nunjucks package has a `*.label-pack.test.ts` that renders the real macro with every pack. Two helpers learned to take what a pack gives: the Gantt macro accepts a `dependencyDetail` object keyed by dependency type, and the data grid client accepts a `sortAnnouncement` object keyed by direction. In Nunjucks an export announcement shows `csv` / `tsv` / `xlsx` in lower case (the helper's existing contract). |
| Blazor | **Through `LabelPack`** (`LabelPacks.cs` in the data-grid package): `LabelPack.FromJson(json).ToDataGridLabels()`, and `ToKanbanLabels()`, `ToCalendarLabels()`, `ToGanttLabels()`, `ToFilterLabels()` in their own packages. Loading the JSON is the app's job. Each package's tests build its labels from every pack. A key the pack lacks leaves the label `null`; the filter's required labels throw instead. |

Not in a pack for any catalog: the labels that depend on how a locale writes dates (weekday names, day names, period titles, the Gantt
column label, the date-time-picker labels).

No catalog has a known label gap: the Gantt `criticalLabel` and the kanban `titleEditor` / `titleEditAnnouncement` reached all
eight on 2026-10-18. `KNOWN_GAPS` in `bin/check-label-packs` is empty and the guard fails the build if one of the TypeScript
ports loses a key. Svelte-only features that carry no label, such as the kanban `allowLaneChange` and the
calendar `periodTitle` anchor argument, are not covered by this check.

## Adding or changing a pack

Copy `en-001.json`, translate every value, keep every `{placeholder}` exactly as written, set `"locale"`, and set `"reviewed": false`.
`bin/check-label-packs` (run by `bin/test`) fails on a missing, extra or empty key, a lost or invented placeholder, or a missing
`reviewed` flag; `label-pack.test.ts` also builds every label from every pack. A new string means a new key in `en-001.json`
first, then in each locale.

Published as `@lilydesignsystem/locale-translations` (`lily-design-system-locale-translations/`, copied by `bin/sync-shared-modules`; every pack is a flat export, `…/locale-translations/cy-001`). Each pack also holds `direction`, `endonym` and `exonyms` (the language named in each pack language), from `~/git/sixarm/locales/locales.tsv`; Bhojpuri has no exonym entries yet.
