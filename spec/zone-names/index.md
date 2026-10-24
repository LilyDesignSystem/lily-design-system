# Zone names (Unicode CLDR)

The localized display names of IANA time zones, one pack per locale, for the time zone pickers.

## Summary

A zone's name in the reader's language (`heure normale d’Europe centrale`, `日本標準時`) is Unicode CLDR data. Browsers and
Node expose it through `Intl`, but with whatever ICU build they carry, and .NET has no API for it at all. Lily therefore
ships it: `shared/zone-names/<locale>.json`, one file for each of the 64 label-pack locales, copied into every
`*-locale-translations` package next to the label packs.

## Scope

In: the long (full) names, standard and daylight, of the zones `Intl.supportedValuesOf("timeZone")` lists plus the current
IANA ids ICU holds under their former names (`Asia/Kolkata` for `Asia/Calcutta`); the generator; the loaders; how a picker
takes them. Out: short names (`CET`), generic names ("Central European Time"), exemplar cities and country names, and any
translation of our own: every name is CLDR's.

## Principles and rules

- **CLDR's words only.** The generator reads each name through ICU (`Intl.DateTimeFormat`, `timeZoneName: "long"`), so the
  CLDR version is Node's (`process.versions.cldr`, 48.0 at the time of writing) and is written into every pack.
- **No borrowed text.** A zone CLDR has no name for in a language is left out of that pack; ICU's fallback to a
  `GMT+01:00` form is detected and dropped. The picker then asks `Intl`, then shows the offset alone. Cornish (`kw`), Scots
  (`sco`) and Wu (`wuu`) have no CLDR zone names, so their packs are empty (`bh` is CLDR's `bho` and names only GMT).
- **Compact.** A pack holds a table of distinct names and, for each zone, an index or a `[standard, daylight]` pair of
  indexes (about 13 kB a pack, since many zones share a name).
- **Same tags as the label packs.** `fr-001` goes with `fr-001`; the picker's `locale` prop is the BCP 47 tag of the language
  (`fr`), which is what sorts the names.
- **Licence.** CLDR is under the Unicode License v3; the notice ships with the packs (`zone-names/UNICODE-LICENSE.txt`,
  and in the NuGet package).

## Format

```json
{ "locale": "fr-001", "cldrLocale": "fr", "cldr": "48.0",
  "names": ["heure normale d’Europe centrale", "heure d’été d’Europe centrale", "..."],
  "zones": { "Europe/Paris": [0, 1], "Africa/Abidjan": 2 } }
```

`cldrLocale` is the locale ICU actually supplied (`null` when CLDR has none for the language). A zone is an index into
`names` (one name all year) or `[standard, daylight]`.

## Using the packs

| Catalog | How |
| ------- | --- |
| Svelte, React, Vue, Angular, HTML, Web Components | `zoneNamesFrom(pack)` (from `@lilydesignsystem/{framework}-locale-translations`) gives the picker's `names` input. |
| Nunjucks | `timeZoneOptions({ locale, names: zoneNamesFrom(pack) })` at build time. |
| Blazor | `LocaleTranslations.ZoneNames("fr-001")` gives the picker's `Names` parameter: `(Standard, Daylight)` per zone. |

A picker's name for a zone is, in order: the supplied `names` entry (its daylight name while daylight time is in force),
else `Intl`'s, else the zone id. In Blazor, else the platform's own name.

## Tooling

`bin/generate-zone-names` writes the packs; `--check` fails when a pack is missing or, at the same CLDR version, differs.
`bin/sync-shared-modules` copies them (and the licence) into the locale-translations packages and `--check` fails on drift.
A newer Node brings newer CLDR: regenerate, review the diff, and publish the packages.

## Acceptance criteria

- [x] A pack for each of the 64 label-pack locales, each saying which CLDR it is from.
- [x] Every index points at a name; names in a pack are unique.
- [x] French differs from English, Japanese names Tokyo `日本標準時`, and the major languages name the common zones.
- [x] No pack carries another language's text: Arabic, Japanese, Russian, Chinese, Korean, Hindi and Thai have fewer than five names equal to English's.
- [x] Cornish, Scots and Wu are empty, not borrowed.
- [x] Current IANA ids (`Asia/Kolkata`, `Europe/Kyiv`) are named, not only ICU's former ids.
- [x] The pickers in all eight catalogs take the names and prefer them to `Intl`; a daylight pair follows the picker's date.

## Related topics

[label-packs](../label-packs/index.md), [internationalization](../internationalization/index.md),
[time-zone-picker](../../lily-design-system-svelte-time-zone-picker/spec/index.md).

## Sources

- [bin/generate-zone-names](../../bin/generate-zone-names)
- [shared/zone-names/](../../shared/zone-names/), [shared/zone-names.ts](../../shared/zone-names.ts), [shared/zones.ts](../../shared/zones.ts)
- [Unicode CLDR](https://cldr.unicode.org/), [Unicode License v3](https://www.unicode.org/license.txt)

---

Lily™ and Lily Design System™ are trademarks.
