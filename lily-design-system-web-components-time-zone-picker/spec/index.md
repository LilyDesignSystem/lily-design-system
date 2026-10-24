# TimeZonePicker — Specification (Web Components helper)

Canonical contract for `@lilydesignsystem/web-components-time-zone-picker`. Ported from the Svelte reference; where the two differ, the Svelte side wins.

## 1. Purpose

A headless control that lets a user pick a time zone from a list ordered by UTC offset, each entry showing the
offset and the zone's full name, and have the app remember it. The component owns the list, the DOM application
and the persistence; the app owns what a zone changes (formatting dates with `timeZone`).

## 2. Scope

In scope: the offset and name of each zone, ordering by offset, the icon button and APG listbox, the initial
value, `data-time-zone` on a target, persistence, change events.
Out of scope: formatting dates, converting between zones, a map or search over all ~600 IANA zones, a bundled zone
table or English names, any CSS.

## 3. HTML

`<div class="time-zone-picker {class}">` containing a hidden input (carries `name`), a `<button
class="time-zone-picker-button" type="button" aria-label="{label}" aria-haspopup="listbox" aria-expanded
aria-controls>` whose only content is the `aria-hidden` clock SVG (`viewBox="0 0 16 16"`, replaceable via
`children`), a `<div class="time-zone-picker-tooltip" role="tooltip" id hidden>` holding `label`, and a `<ul
class="time-zone-picker-list" role="listbox" aria-label="{label}" tabindex="-1" hidden>` of `<li
class="time-zone-picker-option" role="option" aria-selected data-offset="UTC+05:30">` entries, one per zone, with
`data-active` mirroring the `aria-activedescendant` cursor.

Tooltip behaviour is the same as the other pickers: shown on hover (of the button or the tooltip) and
`:focus-visible`, dismissed by `Escape`, never shown while the list is open, not linked by `aria-describedby`.

## 4. Props

| Prop           | Type                         | Required | Default          |
| -------------- | ---------------------------- | -------- | ---------------- |
| `label`        | `string`                     | yes      | —                |
| `locale`       | `string`                     | yes      | —                |
| `zones`        | `readonly string[]`          | no       | `DEFAULT_ZONES`  |
| `date`         | `Date`                       | no       | now, read once   |
| `value`        | `string`                     | no       | `""`             |
| `defaultValue` | `string`                     | no       | —                |
| `storageKey`   | `string`                     | no       | —                |
| `name`         | `string`                     | no       | `"time-zone"`    |
| `target`       | `HTMLElement \| null`        | no       | `<html>`         |
| `labelFor`     | `(zone: ZoneInfo) => string` | no       | `defaultLabel`   |
| `children`     | `Snippet<[ChildArgs]>`       | no       | clock icon       |
| `onChange`     | `(zone: string) => void`     | no       | —                |
| `open`         | `boolean`                    | no       | `false`          |
| `onOpenChange` | `(open: boolean) => void`    | no       | —                |
| `disabled`     | `boolean`                    | no       | `false`          |
| `class`        | `string`                     | no       | `""`             |

## 5. Zones

- A zone is an IANA id. The offset is minutes east of UTC at `date`, computed with `Intl.DateTimeFormat`
  (`formatToParts`), so daylight saving time and half and quarter-hour offsets are exact. It is written
  `UTC±HH:MM` in ASCII.
- The name is `Intl.DateTimeFormat(locale, { timeZoneName: "long" })` at `date`; when `Intl` has none the id is
  shown. The default option text is `{offset} – {name}`; `labelFor` replaces it.
- Order: offset ascending, then name (`Intl.Collator(locale)`), then id. Unknown ids are dropped; repeats
  collapse.
- `DEFAULT_ZONES` is a curated list of 55 ids, one for each common offset and name, from `Pacific/Pago_Pago`
  (UTC−11) to `Pacific/Kiritimati` (UTC+14).

## 6. Behaviour

- Initial value: `value` > stored zone (only if still offered) > `defaultValue` > the reader's zone
  (`Intl.DateTimeFormat().resolvedOptions().timeZone`) if listed, or the listed zone with the same offset and name
  > `UTC` if offered > the first zone > none (an empty list applies nothing).
- Applying is idempotent: an already-applied zone writes nothing and calls nothing. `onChange` fires once per
  applied change, including the initial one.
- Choosing an option selects, applies, closes, and returns focus to the button.
- Keyboard follows the APG listbox pattern as the other three listbox pickers; typeahead matches the start of the
  option text, so `UTC+05` reaches `UTC+05:30`.
- SSR-safe: `data-time-zone`, storage and the system-zone lookup happen only in an effect.

## 7. Acceptance criteria

Each is asserted in `TimeZonePicker.test.ts` or `zones.test.ts`.

- [x] 7.1 A `<button>` with `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls` the listbox.
- [x] 7.2 `label` names the button and the listbox and is the tooltip text; the tooltip is not `aria-describedby`.
- [x] 7.3 One option per known zone; hidden input has `name` and the IANA id.
- [x] 7.4 Options are ordered by offset west to east, whatever the input order; ties by name then id.
- [x] 7.5 Each option shows `{offset} – {full name}` in `locale`; `data-offset` carries the offset.
- [x] 7.6 `date` decides offsets and names (summer time shows the summer offset and name).
- [x] 7.7 Half-hour and quarter-hour offsets are exact; the offset is that at the instant, not today's.
- [x] 7.8 Choosing a zone sets value, hidden input, `aria-selected`, `data-time-zone`, closes the list.
- [x] 7.9 `onChange` fires once per change and not for an unchanged zone.
- [x] 7.10 Initial value resolution as in §6, including the listed twin and the `UTC` and first-zone fallbacks.
- [x] 7.11 Persistence under `storageKey`; a stored zone no longer offered is not restored.
- [x] 7.12 APG keyboard contract; typeahead over the offset; `Escape` leaves the value unchanged.
- [x] 7.13 Unknown zones are left out, repeats collapse, an empty list applies nothing.
- [x] 7.14 `disabled`, `onOpenChange`, `children` icon override, unique ids.

---

Lily™ and Lily Design System™ are trademarks.
