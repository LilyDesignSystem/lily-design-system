# Label packs

> Lily Design System™ specification — topic doc. All topics: [spec index](../index.md).

**Summary.** Lily ships no English defaults, so every app that uses a grid-like helper used to write and translate the same
hundred-odd `labels` strings. A *label pack* is that work done once: one JSON file per locale in
[`shared/label-packs/`](../../shared/label-packs/) holding the strings for the data grid, kanban board, calendar, Gantt chart
and filter, plus a small loader per catalog that turns a pack into the `labels` the helper takes. Added 2026-10-18.
**Forty-five of the forty-six packs are unreviewed machine drafts.**

## Scope

In: the pack format, the loaders (TypeScript, Nunjucks, Blazor), the 46 locales, and the checks that keep packs and helpers in step.
Out: anything that depends on how a locale writes dates (weekday and day names, period titles and announcements, the Gantt column
label, the date-time-picker labels) — build those with `Intl` or the culture; pickers (their labels are few and per-app); publishing
the packs as a package (not done yet).

## Principles and rules

- **No English default, and no fallback to another language.** A key a pack lacks leaves its label unset, so the control is unnamed
  (and the helper says so in development) rather than showing text from another language.
- **One contract, three loaders.** The pack is the contract. `shared/label-pack.ts` is the reference loader; Nunjucks and Blazor
  adapt it to their helpers' own shapes. English (`en-001`) is the base: a new string is added there first, then to every locale.
- **Reviewed or not is data.** Every pack carries `"reviewed": true | false`; only English is `true`. Flip a pack only when a native
  speaker has checked it. Screen-reader wording (names, announcements) deserves the closest review.

## The pack format

```json
{
  "locale": "ta-001",
  "reviewed": false,
  "common":  { "search": "…", "exportAnnouncement": "{count} … {format}: {filename}", … },
  "data-grid": { "pageStatus": "… {page} … {pageCount} … {rowCount}", "sortAnnouncement": { "ascending": "…", "descending": "…", "none": "…" }, … },
  "kanban-board": {}, "calendar": {}, "gantt-chart": {}, "filter": { "operators": { "contains": "…" } }
}
```

- A string is a plain label or a template with `{placeholder}`s. The placeholder names, and the argument each one reads, are the `SPEC`
  table in `shared/label-pack.ts` (for example `card=card.title` reads a property; `@collapsed` selects by the argument's value).
- An object whose keys are values (`true` / `false`, `ascending`, `e2s`, `day` …) is a **select**: the wording depends on that
  value. Export headers and the filter's operator names are plain groups.
- `common` holds what several helpers share (search, export, copy); the filter takes none of it.

## Loaders

| Catalog | Use |
| ------- | --- |
| Svelte, React, Vue, Angular, HTML, Web Components | `labelsFor(helper, pack)` — a drop-in `labels`. `bin/check-label-packs` fails when a pack key is missing from a helper's `labels` type or takes a different number of arguments. |
| Nunjucks | `nunjucksLabelsFor(helper, pack, { view })` returns `{ macro, client }`: `macro` is the JSON-safe `labels` for the macro in the helper's own names and tokens (two-state labels split in two); `client` is the same pack as functions for `initX(root, { labels })`. An export announcement shows `csv` / `tsv` / `xlsx` in lower case (the helper's contract). |
| Blazor | `LabelPack.FromJson(json)` then `ToDataGridLabels()`, `ToKanbanLabels()`, `ToCalendarLabels()`, `ToGanttLabels()`, `ToFilterLabels()`. Loading the JSON is the app's job. A missing key leaves the label `null`; the filter's required labels throw. |

## Locales

`ar bg bh bn cs cy da de el en es et eu fa fi fr ga gu ha hi hr hu id it ja jv ko lt lv mr mt nl pa pl pt ro ru sk sl sv ta te tr ur vi zh`,
each as `<code>-001`. `bh-001` follows the requested tag; Bhojpuri's ISO code is `bho`. Right-to-left packs (`ar`, `fa`, `ur`) keep their
placeholders in logical order.

## Acceptance criteria

- [x] Every pack has the English pack's keys, none empty, and each string keeps exactly the placeholders English uses (`bin/check-label-packs`, in `bin/test`).
- [x] The Svelte helpers and the five TypeScript ports still have every key a pack holds, with matching argument counts (same script; `KNOWN_GAPS` is empty).
- [x] Every Nunjucks package renders its macro with every pack and leaves no placeholder in a visible label (`*.label-pack.test.ts`).
- [x] Every Blazor package builds its labels from every pack (`*LabelPackTests.cs`).
- [x] `shared/label-pack.test.ts` and `shared/label-pack-nunjucks.test.ts` build every label from every pack.
- [ ] Native-speaker review of the 45 draft packs (Welsh included).
- [x] Packaged (2026-10-18, not yet published): `@lilydesignsystem/locale-translations` (npm, one flat export per locale; the `reviewed` flag, not a path, marks a draft) and `LilyDesignSystem.Blazor.LocaleTranslations` (NuGet, packs embedded). Each pack also holds `direction`, `endonym` and `exonyms`.

## Related topics

[helpers](../helpers/index.md) · [internationalization](../internationalization/index.md) · [testing](../testing/index.md) · [tooling](../tooling/index.md)

## Sources

[`shared/label-pack.ts`](../../shared/label-pack.ts) · [`shared/label-pack-nunjucks.ts`](../../shared/label-pack-nunjucks.ts) ·
[`shared/label-packs/`](../../shared/label-packs/index.md) · [`bin/check-label-packs`](../../bin/check-label-packs) ·
[`LabelPacks.cs`](../../lily-design-system-blazor-data-grid/LabelPacks.cs)
