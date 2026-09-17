# Install

This repository is the Web Components helpers catalog: six opinionated packages that each own one complete interaction.

It is published as a `git subtree` from the canonical Lily Design System™
monorepo at <https://github.com/LilyDesignSystem/lily-design-system>. Issues and pull requests are handled there.

Full documentation and the searchable component catalog: <https://lilydesignsystem.com/>

## Install

This catalog ships seven helper packages, all published to npm.
Install only what you need:

| Package | Owns |
| --- | --- |
| `@lilydesignsystem/web-components-theme-picker` | theme preference |
| `@lilydesignsystem/web-components-locale-picker` | locale preference (`lang` / `dir`) |
| `@lilydesignsystem/web-components-text-size-picker` | text-size preference |
| `@lilydesignsystem/web-components-motion-picker` | reduced-motion preference |
| `@lilydesignsystem/web-components-share-picker` | a share action |
| `@lilydesignsystem/web-components-date-time-picker` | a date-time form value |
| `@lilydesignsystem/web-components-picker-bar` | composes theme/locale/text-size/share into one page-header row |

```sh
npm install @lilydesignsystem/web-components-theme-picker
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
