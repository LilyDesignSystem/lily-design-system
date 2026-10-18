# Blazor locale translations — specification

`LilyDesignSystem.Blazor.LocaleTranslations` 0.1.0 (2026-10-18).

1. Embeds all 46 packs from the npm package's `label-packs/` directory, one resource per locale, so there is one set of files.
2. `Locales`, `Json`, `Endonym`, `Exonym`, `Reviewed` as in [index.md](../index.md); an unknown locale throws `ArgumentException`.
3. No dependency on the helper packages: parsing into labels stays `LabelPack.FromJson`.
4. Tests: `LocaleTranslationsTests.cs` (46 packs, names, reviewed flags, unknown locale).
