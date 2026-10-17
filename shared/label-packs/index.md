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

| Catalog | Fit |
| ------- | --- |
| Svelte, React, Vue, Angular, HTML, Web Components | **Same shape.** The same label keys, the same argument count and order, the same union values (`four-week`, `e2s`, `ascending`, …) and the same object fields (`card.title`, `task.label`). `labelsFor(helper, pack)` output is a drop-in `labels`. `bin/check-label-packs` keeps this true. |
| Nunjucks | **Not drop-in.** Label functions are string templates with the Svelte *parameter* names (`{matchCount}`, `{totalCount}`, `{selectedCount}`, `{rowCount}`, `{direction}`), not the pack's (`{matches}`, `{total}`, `{count}`), and a template cannot select a wording by value, so `{direction}` would show the English word `ascending`. It needs an adapter that renames placeholders and a client option that accepts functions (the filter already has one; the grid-like helpers read their labels from JSON only). |
| Blazor | **Same shape, different names, no loader.** Typed records with `Func<…>` in the same argument order, but a few keys are named differently (`FieldUndoAnnouncement` / `FieldRedoAnnouncement` for the calendar and Gantt `undoAnnouncement` / `redoAnnouncement`), `rangeLimit` is not implemented, and nothing in C# builds a `Func` from a template yet. |

The TypeScript ports have no known label gaps (the Gantt `criticalLabel` and the kanban `titleEditor` /
`titleEditAnnouncement` reached all five on 2026-10-18); `KNOWN_GAPS` in `bin/check-label-packs` is empty and fails the
build if a port loses a key. Svelte-only features that carry no label, such as the kanban `allowLaneChange` and the
calendar `periodTitle` anchor argument, are not covered by this check.

## Adding or changing a pack

Copy `en-001.json`, translate every value, keep every `{placeholder}` exactly as written, set `"locale"`, and set `"reviewed": false`.
`bin/check-label-packs` (run by `bin/test`) fails on a missing, extra or empty key, a lost or invented placeholder, or a missing
`reviewed` flag; `label-pack.test.ts` also builds every label from every pack. A new string means a new key in `en-001.json`
first, then in each locale.

Not yet published as a package: the packs and `label-pack.ts` live in `shared/`.
