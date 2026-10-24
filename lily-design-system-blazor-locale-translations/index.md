# Lily Design System™ Blazor locale translations

`LilyDesignSystem.Blazor.LocaleTranslations` — the 64 per-locale label packs, embedded in the assembly, so a Blazor app needs no file path or `HttpClient` to load one.

```csharp
var pack = LabelPack.FromJson(LocaleTranslations.Json("cy-001"));   // LabelPack: the data-grid package
<DataGrid Labels="pack.ToDataGridLabels()" … />
```

| Member | What it is |
| ------ | ---------- |
| `Locales` | The 49 locale tags. |
| `Json(locale)` | One pack's JSON text. |
| `Endonym(locale)`, `Exonym(locale, inLocale)` | The language's name in itself and in another pack's language (none for Bhojpuri). |
| `Reviewed(locale)` | Only `en-001` is reviewed; the other 63 are machine drafts, so have a native speaker read one before it ships. |

The packs are the npm package `@lilydesignsystem/locale-translations`'s files (edited in `shared/label-packs/`); this package embeds that copy.

## Time zone names (Unicode CLDR)

The localized display names of IANA time zones, one pack per locale (all 64), for `TimeZonePicker`:

```csharp
IReadOnlyDictionary<string, (string Standard, string? Daylight)> names = LocaleTranslations.ZoneNames("fr-001");
// <TimeZonePicker Locale="fr" Names="@names" />
```

`ZoneNameLocales`, `ZoneNamesJson(locale)` and `ZoneNamesCldrVersion(locale)` are the rest of the API. A zone CLDR has no name for in a language is not in its pack, never filled from another language; Cornish, Scots and Wu have none at all. The CLDR licence notice ships in the package. See [spec/zone-names](../spec/zone-names/index.md).

