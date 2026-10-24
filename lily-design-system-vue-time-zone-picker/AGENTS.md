# AGENTS — TimeZonePicker (Vue helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything below is a fast index.

## What this package is

A headless Vue time zone picker. An icon button (a clock) opens an APG listbox of IANA time zones, each
shown as its UTC offset and its full name from `Intl`, ordered by offset. The chosen id is applied as
`data-time-zone` on the document root, with optional `localStorage` persistence. No CSS.

## Files

| File                     | Purpose                                                        |
| ------------------------ | -------------------------------------------------------------- |
| `spec/index.md`          | Specification-driven contract (canonical).                     |
| `TimeZonePicker.vue`  | The component. TypeScript + Vue runes.                    |
| `zones.ts`               | Pure zone logic: offsets, names, order, matching. No DOM.      |
| `zones.test.ts`          | Tests for `zones.ts` (DST, half-hour offsets, locales).        |
| `TimeZonePicker.test.ts` | Component tests, one per §7 acceptance clause.                 |
| `index.ts`               | Barrel re-export.                                              |
| `index.md`               | User guide.                                                    |

## Public surface

Default export and `TimeZonePicker`; `DEFAULT_ZONES`; types `Props`, `ChildArgs`, `ZoneInfo`; the `zones.ts`
functions. Required props: `label`, `locale`.

## Behaviour contract (one paragraph)

On every change the picker (1) sets `data-time-zone="{IANA id}"` on `target` (default `<html>`), (2) writes the id
to `localStorage[storageKey]` if given, (3) calls `onChange(id)`. Options are ordered by UTC offset on `date`,
labelled `UTC±HH:MM – {Intl long zone name in locale}`. Initial value: `value` > stored (if still offered) >
`defaultValue` > the reader's zone or its listed twin > `UTC` > first.

## Conventions

- `locale` is required; there is no English text and no zone table in the package. Offsets and names are
  `Intl`-derived.
- Vue runes; composes `IconButton` and `Listbox` (`navigation="active-descendant"`) from
  `@lilydesignsystem/vue-headless`, like the other pickers.
- No bundled CSS, fonts or images; the clock icon is an inline SVG.
