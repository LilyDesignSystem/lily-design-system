# TimeZonePicker (Vue helper)

A reusable Vue headless **time zone picker**: an icon button that opens a WAI-ARIA APG listbox of time
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

```vue
<script setup lang="ts">
import { ref } from "vue";
import TimeZonePicker from "@lilydesignsystem/vue-time-zone-picker";
const zone = ref("");
</script>

<template>
  <TimeZonePicker label="Time zone" locale="en-GB" v-model:value="zone" storage-key="lily-time-zone" />
</template>
```

Vue idioms: `v-model:value` binds the zone and `v-model:open` the popup; a `change` event fires once per applied change; the default scoped slot replaces the icon and receives `{ value, open, infoFor }` (`infoFor` is `undefined`-safe: call it as `infoFor(value)?.offset`, since `value` is empty until a zone is resolved).

## Props

| Prop           | Type                        | Required | Description                                                                                      |
| -------------- | --------------------------- | -------- | ------------------------------------------------------------------------------------------------ |
| `label`        | `string`                    | yes      | Accessible name for the button and the listbox; also the tooltip text.                           |
| `locale`       | `string`                    | yes      | BCP 47 tag the zone names are written in. No default: the picker never picks a language for you. |
| `zones`        | `readonly string[]`         | no       | IANA ids to offer. Default `DEFAULT_ZONES` (55 representative zones). Shown by offset, not in the order given. |
| `date`         | `Date`                      | no       | The moment offsets and names are worked out for. Default: now, read once.                        |
| `value`        | `string`                    | no       | Selected IANA id. Two-way bindable.                                                              |
| `defaultValue` | `string`                    | no       | Initial zone when nothing else is supplied.                                                      |
| `storageKey`   | `string`                    | no       | If set, persist the zone to `localStorage`.                                                      |
| `name`         | `string`                    | no       | `name` of the hidden input (default `"time-zone"`).                                              |
| `target`       | `HTMLElement \| null`       | no       | Element to receive `data-time-zone`. Default `<html>`.                                           |
| `labelFor`     | `(zone: ZoneInfo) => string`| no       | Builds an option's text. Default `UTC+01:00 – Central European Standard Time`.                   |
| `names`        | `ZoneNames`                 | no       | Zone names by IANA id (a name, or `[standard, daylight]`) that win over `Intl`: the CLDR packs, below. |
| `children`     | `Snippet<[ChildArgs]>`      | no       | Replaces the clock icon.                                                                         |
| `onChange`     | `(zone: string) => void`    | no       | Called once after a new zone is applied.                                                         |
| `open`         | `boolean`                   | no       | Is the popup open? Bindable.                                                                     |
| `onOpenChange` | `(open: boolean) => void`   | no       | Fires whenever the open state changes.                                                           |
| `disabled`     | `boolean`                   | no       | Disables the button.                                                                             |
| `className`    | `string`                    | no       | Extra CSS class on the root.                                                                     |

The pure functions are exported too: `orderedZones`, `zoneInfo`, `offsetMinutes`, `formatOffset`, `zoneName`,
`matchZone`, `systemZone`, `defaultLabel`.

## Zone names from Unicode CLDR

By default the full names come from `Intl`, so they are whatever ICU data the browser or server carries. For the same
name in every runtime, pass the Unicode CLDR names that `@lilydesignsystem/vue-locale-translations` ships, one pack
per label-pack locale (all 64), with the pack's own locale tag as the picker's `locale`:

```vue
<script setup lang="ts">
import TimeZonePicker from "@lilydesignsystem/vue-time-zone-picker";
import { zoneNamesFrom } from "@lilydesignsystem/vue-locale-translations";
import fr from "@lilydesignsystem/vue-locale-translations/zone-names/fr-001";
const names = zoneNamesFrom(fr);
</script>

<template>
  <TimeZonePicker label="Fuseau horaire" locale="fr" :names="names" />
</template>
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
