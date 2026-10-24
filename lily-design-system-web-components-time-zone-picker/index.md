# TimeZonePicker (Web Components helper)

A reusable Web Components headless **time zone picker**: an icon button that opens a WAI-ARIA APG listbox of time
zones, each shown as its UTC offset and its full name (`UTC+05:30 – India Standard Time`), **ordered by offset**
from west to east. On every change it sets `data-time-zone="{IANA id}"` on a target element (default
`document.documentElement`), optionally persisting the choice to `localStorage`. Ships no CSS.

The value is an IANA zone id (`Asia/Kolkata`), which is what `Intl.DateTimeFormat({ timeZone })` and every
date library take. The offsets and names are not a table in this package: they are computed with `Intl` for the
`locale` you pass, on the `date` you pass (default now), so the same zone reads `UTC-05:00 – Eastern Standard
Time` in January and `UTC-04:00 – Eastern Daylight Time` in July, and `Central European Standard Time` becomes
`heure normale d’Europe centrale` for `fr`.

```js
// What the app does with the choice:
new Intl.DateTimeFormat(locale, { timeZone: document.documentElement.dataset.timeZone }).format(date);
```

## Usage

```html
<script type="module">
  import "@lilydesignsystem/web-components-time-zone-picker";
</script>

<lily-time-zone-picker label="Time zone" locale="en-GB" storage-key="lily-time-zone"></lily-time-zone-picker>
```

HTML idioms: `<lily-time-zone-picker>` is a custom element registered by importing the package. Attributes: `label`, `locale`, `zones` (comma-separated IANA ids), `date` (ISO), `value`, `default-value`, `storage-key`, `name`, `class`, `open`, `disabled`. Properties: `zones`, `date`, `labelFor`, `target`, `open`, `disabled`, and the `infoFor(zone)` method. Events: `timezonechange` (`detail.zone`, once per applied change) and `openchange`. Subclass and override `renderButtonContent()` to replace the icon.

## Props

See the idioms above; every prop of the Svelte reference is an attribute or a property of the element (kebab-case attributes: `default-value`, `storage-key`). `locale` is required.

The pure functions are exported too: `orderedZones`, `zoneInfo`, `offsetMinutes`, `formatOffset`, `zoneName`,
`matchZone`, `systemZone`, `defaultLabel`.

## Behaviour

- **Order**: by UTC offset ascending (`UTC-11:00` first, `UTC+14:00` last); ties by name (compared in `locale`),
  then by id. An id the runtime does not know is left out; a repeated id appears once.
- **Initial value**: `value` > stored zone (only if still offered) > `defaultValue` > the reader's own zone when
  listed, or its listed twin (same offset and name: `Europe/Berlin` → `Europe/Paris`) > `UTC` > the first zone.
- **Date**: offsets are fixed for the picker's `date` (read once when none is given) so an open list never
  re-sorts under the pointer. Pass a `date` to show the offsets for a specific day.
- SSR-safe: all DOM writes happen inside an effect; the zone list is computed without the DOM.

## Accessibility

- WCAG 2.2 AAA target.
- APG listbox keyboard contract: ArrowDown / ArrowUp / Enter / Space open; arrows clamp; `Home` / `End`;
  `PageUp` / `PageDown` by ten; typeahead over the option text (type `UTC+05` to reach it); `Escape` closes
  without changing the value; `Tab` closes and moves on.
- The offset is written in ASCII (`UTC+05:30`, hyphen-minus), so typeahead and screen readers read it the same
  everywhere; the zone name comes from `Intl` in the reader's language.
- A tooltip repeats the label on hover and focus, dismissable with `Escape`, and is not linked with
  `aria-describedby`.

---

Lily™ and Lily Design System™ are trademarks.
