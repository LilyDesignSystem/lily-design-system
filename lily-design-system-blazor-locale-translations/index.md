# Lily Design System™ Blazor locale translations

`LilyDesignSystem.Blazor.LocaleTranslations` — the 46 per-locale label packs, embedded in the assembly, so a Blazor app needs no file path or `HttpClient` to load one.

```csharp
var pack = LabelPack.FromJson(LocaleTranslations.Json("cy-001"));   // LabelPack: the data-grid package
<DataGrid Labels="pack.ToDataGridLabels()" … />
```

| Member | What it is |
| ------ | ---------- |
| `Locales` | The 46 locale tags. |
| `Json(locale)` | One pack's JSON text. |
| `Endonym(locale)`, `Exonym(locale, inLocale)` | The language's name in itself and in another pack's language (none for Bhojpuri). |
| `Reviewed(locale)` | Only `en-001` is reviewed; the other 45 are machine drafts, so have a native speaker read one before it ships. |

The packs are the npm package `@lilydesignsystem/locale-translations`'s files (edited in `shared/label-packs/`); this package embeds that copy.
