# Install

This repository is the Blazor helpers catalog: five opinionated packages that each own one complete interaction.

It is published as a `git subtree` from the canonical Lily Design System™
monorepo at <https://github.com/LilyDesignSystem/lily-design-system>. Issues and pull requests are handled there.

Full documentation and the searchable component catalog: <https://lilydesignsystem.github.io/>

## Install

This catalog ships five helper packages as Razor class libraries. **They are
built but not yet published to NuGet**; until they are, clone this repository and
reference the `.csproj` you need:

| Package | Owns |
| --- | --- |
| `LilyDesignSystem.Blazor.ThemePicker` | theme preference |
| `LilyDesignSystem.Blazor.LocalePicker` | locale preference (`lang` / `dir`) |
| `LilyDesignSystem.Blazor.TextSizePicker` | text-size preference |
| `LilyDesignSystem.Blazor.SharePicker` | a share action |
| `LilyDesignSystem.Blazor.DateTimePicker` | a date-time form value |

```sh
git clone https://github.com/LilyDesignSystem/lily-design-system-blazor-helpers.git
```

## License

Free open source, under your choice of MIT, Apache-2.0, GPL-2.0-only,
GPL-3.0-only, or BSD-3-Clause. See [LICENSE.md](LICENSE.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Work happens in the canonical monorepo.

---

Lily™ and Lily Design System™ are trademarks.
