# Install

This repository is the 45 reference theme stylesheets, packaged for npm.

It is published as a `git subtree` from the canonical Lily Design System™
monorepo at <https://github.com/LilyDesignSystem/lily-design-system>. Issues and pull requests are handled there.

Full documentation and the searchable component catalog: <https://lilydesignsystem.com/>

## Install

```sh
npm install @lilydesignsystem/themes
```

CSS only, no build step and no JavaScript. Reference a theme by its
slug via a subpath import or a `<link>`:

```js
import "@lilydesignsystem/themes/light.css";
```

```html
<link rel="stylesheet" href="/node_modules/@lilydesignsystem/themes/light.css">
```

Each file name is the `data-theme="{slug}"` value the `theme-picker`
helper sets — see
[AGENTS/helpers.md](https://github.com/LilyDesignSystem/lily-design-system/blob/main/AGENTS/helpers.md). Every
selector is `:where(...)` or `@layer lily { ... }` (zero specificity),
so your own CSS always wins the cascade — see
[AGENTS/theme.md](https://github.com/LilyDesignSystem/lily-design-system/blob/main/AGENTS/theme.md).

## License

Free open source, under your choice of MIT, Apache-2.0, GPL-2.0-only,
GPL-3.0-only, or BSD-3-Clause. See [LICENSE.md](LICENSE.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Work happens in the canonical monorepo.

---

Lily™ and Lily Design System™ are trademarks.
