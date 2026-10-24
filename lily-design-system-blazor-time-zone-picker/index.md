# TimeZonePicker (Blazor helper)

A reusable Blazor headless **time zone picker**: an icon button that opens a WAI-ARIA APG listbox of time
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

```razor
@using LilyDesignSystem.Blazor.Helpers

<TimeZonePicker Label="Time zone" Locale="en-GB" @bind-Value="zone" StorageKey="lily-time-zone" />

@code {
    private string zone = "";
}
```

Blazor idioms: install `LilyDesignSystem.Blazor.TimeZonePicker`; `@bind-Value` and `@bind-Open` bind the zone and the popup, `OnChange` fires once per applied change, `CssClass` adds a class to the root, unmatched attributes land on the root, and `ChildContent` is a `RenderFragment<TimeZonePickerContext>` replacing the icon (`context.InfoFor(context.Value)`). The pure rules are public as the static class `TimeZones` (`Ordered`, `Info`, `OffsetMinutes`, `FormatOffset`, `MatchZone`, `DefaultZones`).

**Deviation from the other catalogs:** .NET has no API for a zone's full name in an arbitrary locale (`Intl` has one; `TimeZoneInfo` does not). Offsets and order are exact (`TimeZoneInfo`), and the name is, in order: the `Names` parameter (a dictionary of IANA id to name, in the reader's language), else the platform's own standard or daylight name. Build `Names` from resource files, or in the browser with `Intl.DateTimeFormat` through JS interop, when the name must be localized. The reader's own zone is read from the browser (`Intl.DateTimeFormat().resolvedOptions().timeZone`), not from the server's `TimeZoneInfo.Local`.

## Props

| Parameter       | Type                                      | Required | Description |
| --------------- | ----------------------------------------- | -------- | ----------- |
| `Label`         | `string`                                  | yes      | Accessible name for the button and the listbox; also the tooltip text. |
| `Locale`        | `string`                                  | yes      | BCP 47 tag the names are sorted and matched in. No default: the picker never picks a language for you. |
| `Zones`         | `IReadOnlyList<string>`                   | no       | IANA ids to offer. Default `TimeZones.DefaultZones` (55 zones). Shown by offset, not in the order given. |
| `Date`          | `DateTimeOffset?`                         | no       | The moment offsets and names are worked out for. Default: now, read once. |
| `Names`         | `IReadOnlyDictionary<string, string>`     | no       | Full zone names by IANA id, in the reader's language (see the deviation above). |
| `LabelFor`      | `Func<ZoneEntry, string>`                 | no       | Builds an option's text. Default `UTC+01:00 – Central European Standard Time`. |
| `Value`         | `string`                                  | no       | Selected IANA id. Bindable (`@bind-Value`). |
| `DefaultValue`  | `string`                                  | no       | Initial zone when nothing else is supplied. |
| `StorageKey`    | `string`                                  | no       | If set, persist the zone to `localStorage`. |
| `Name`          | `string`                                  | no       | `name` of the hidden input (default `"time-zone"`). |
| `ChildContent`  | `RenderFragment<TimeZonePickerContext>`   | no       | Replaces the clock icon; the context has `Value`, `Open` and `InfoFor`. |
| `OnChange`      | `EventCallback<string>`                   | no       | Called once after a new zone is applied. |
| `Open`          | `bool`                                    | no       | Is the popup open? Bindable (`@bind-Open`). |
| `Disabled`      | `bool`                                    | no       | Disables the button. |
| `CssClass`      | `string`                                  | no       | Extra CSS class on the root. |

The pure rules are public in the static class `TimeZones`: `Ordered`, `Info`, `OffsetMinutes`, `FormatOffset`, `ZoneName`, `MatchZone`, `DefaultLabel`, `DefaultZones`.

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
