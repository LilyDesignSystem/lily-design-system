# TimeZonePicker (Nunjucks helper)

A reusable Nunjucks headless **time zone picker**: an icon button that opens a WAI-ARIA APG listbox of time
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

```njk
{% from "@lilydesignsystem/nunjucks-time-zone-picker/template" import timeZonePicker %}
{{ timeZonePicker({
  label: "Time zone",
  locale: "en-GB",
  options: zoneOptions,
  storageKey: "lily-time-zone"
}) }}
```

Build `zoneOptions` where the page is built (a Nunjucks macro cannot call `Intl`), then load the client script once:

```js
import { timeZoneOptions, autoInit } from "@lilydesignsystem/nunjucks-time-zone-picker";

// at build time (an Eleventy global, a filter, a view model):
const zoneOptions = timeZoneOptions({ locale: "en-GB" });

// in the browser:
autoInit();
```

Nunjucks idioms: the macro takes one `opts` object (`label`, `locale`, `options` are required; `date`, `value`, `defaultValue`, `storageKey`, `name`, `id`, `open`, `disabled`, `classes`, `attributes` are optional), and a `{% call %}` block replaces the icon. `options` is the output of `timeZoneOptions({ locale, zones?, date?, labelFor?, names? })`, already ordered by offset. The client (`initTimeZonePicker(root, { onChange, target })`, `autoInit()`) returns `{ setZone, setOpen, setDisabled, isOpen, destroy }`. The button does nothing until the client runs.

## Props

See the idioms above: the macro parameters are the Svelte props, with `options` (from `timeZoneOptions()`) in place of `zones` and `labelFor`, since a macro cannot call `Intl`. `label`, `locale` and `options` are required.

The pure functions are exported too: `orderedZones`, `zoneInfo`, `offsetMinutes`, `formatOffset`, `zoneName`,
`matchZone`, `systemZone`, `defaultLabel`.

## Zone names from Unicode CLDR

By default the full names come from `Intl`, so they are whatever ICU data the browser or server carries. For the same
name in every runtime, pass the Unicode CLDR names that `@lilydesignsystem/nunjucks-locale-translations` ships, one pack
per label-pack locale (all 64), with the pack's own locale tag as the picker's `locale`:

```js
import { timeZoneOptions } from "@lilydesignsystem/nunjucks-time-zone-picker";
import { zoneNamesFrom } from "@lilydesignsystem/nunjucks-locale-translations";
import fr from "@lilydesignsystem/nunjucks-locale-translations/zone-names/fr-001";

const zoneOptions = timeZoneOptions({ locale: "fr", names: zoneNamesFrom(fr) });
```

A pack names about 425 zones, with the daylight name where a zone has one. A zone CLDR has no name for in that language
is not in the pack and falls back to `Intl`, never to another language. Cornish, Scots and Wu have no CLDR zone names, so
their packs are empty. See [spec/zone-names](../spec/zone-names/index.md).

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
