# Install

This repository is the HTML helpers catalog: six opinionated packages that each own one complete interaction.

It is published as a `git subtree` from the canonical Lily Design System™
monorepo at <https://github.com/LilyDesignSystem/lily-design-system>. Issues and pull requests are handled there.

Full documentation and the searchable component catalog: <https://lilydesignsystem.com/>

## Install

This catalog ships seven helper packages, all published to npm.
Install only what you need:

| Package | Owns |
| --- | --- |
| `@lilydesignsystem/html-theme-picker` | theme preference |
| `@lilydesignsystem/html-locale-picker` | locale preference (`lang` / `dir`) |
| `@lilydesignsystem/html-text-size-picker` | text-size preference |
| `@lilydesignsystem/html-motion-picker` | reduced-motion preference |
| `@lilydesignsystem/html-share-picker` | a share action |
| `@lilydesignsystem/html-date-time-picker` | a date-time form value |
| `@lilydesignsystem/html-picker-bar` | composes theme/locale/text-size/share into one page-header row |

```sh
npm install @lilydesignsystem/html-theme-picker
```

Every user-facing string is a prop — there are no English defaults to override.
All are SSR-safe and ship no CSS. Contracts:
[AGENTS/helpers.md](https://github.com/LilyDesignSystem/lily-design-system/blob/main/AGENTS/helpers.md) and
[spec/helpers/index.md](https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/helpers/index.md).

## License

Free open source, under your choice of MIT, Apache-2.0, GPL-2.0-only,
GPL-3.0-only, or BSD-3-Clause. See [LICENSE.md](LICENSE.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Work happens in the canonical monorepo.

---

Lily™ and Lily Design System™ are trademarks.
