# Install

This repository is the HTML helpers catalog: five opinionated packages that each own one complete interaction.

It is published as a `git subtree` from the canonical Lily Design System™
monorepo at <https://github.com/LilyDesignSystem/lily-design-system>. Issues and pull requests are handled there.

Full documentation and the searchable component catalog: <https://lilydesignsystem.github.io/>

## Install

This catalog ships five helper packages, all published to npm at `0.1.0`.
Install only what you need:

| Package | Owns |
| --- | --- |
| `lily-design-system-html-theme-picker` | theme preference |
| `lily-design-system-html-locale-picker` | locale preference (`lang` / `dir`) |
| `lily-design-system-html-text-size-picker` | text-size preference |
| `lily-design-system-html-share-picker` | a share action |
| `lily-design-system-html-date-time-picker` | a date-time form value |

```sh
npm install lily-design-system-html-theme-picker
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
