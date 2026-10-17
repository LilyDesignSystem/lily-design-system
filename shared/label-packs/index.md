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
| `en-001` | English (the base) | yes |
| `bh-001` | Bhojpuri | no |
| `eu-001` | Basque | no |
| `fa-001` | Persian (right to left) | no |
| `gu-001` | Gujarati | no |
| `ha-001` | Hausa | no |
| `jv-001` | Javanese | no |
| `mr-001` | Marathi | no |
| `pa-001` | Punjabi (Gurmukhi) | no |
| `ta-001` | Tamil | no |
| `te-001` | Telugu | no |

**Every pack except English is an unreviewed machine draft.** A `"reviewed": false` pack should be read by a native speaker
before it ships in a product; flip the flag only when one has. Bhojpuri has no ISO 639-1 code (`bh` is deprecated; the language is
`bho`), so `bh-001` follows the requested tag. Terminology is a first pass, and screen-reader wording in particular deserves
review.

## Adding or changing a pack

Copy `en-001.json`, translate every value, keep every `{placeholder}` exactly as written, set `"locale"`, and set `"reviewed": false`.
`bin/check-label-packs` (run by `bin/test`) fails on a missing, extra or empty key, a lost or invented placeholder, or a missing
`reviewed` flag; `label-pack.test.ts` also builds every label from every pack. A new string means a new key in `en-001.json`
first, then in each locale.

Not yet published as a package: the packs and `label-pack.ts` live in `shared/`.
