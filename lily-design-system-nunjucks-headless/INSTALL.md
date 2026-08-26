# Install

This repository is the Nunjucks headless component library: all 491 catalog components, unstyled and accessible.

It is published as a `git subtree` from the canonical Lily Design System™
monorepo at <https://github.com/LilyDesignSystem/lily-design-system>. Issues and pull requests are handled there.

Full documentation and the searchable component catalog: <https://lilydesignsystem.github.io/>

## Install

**This package is not yet published to npm.** Until it is, use either:

**Copy the markup.** Lily is headless — a component is its semantic HTML, its
ARIA, and its class hook. Take it from the catalog at <https://lilydesignsystem.github.io/> and paste it
anywhere. No dependency, no build step.

**Or clone and copy the component files:**

```sh
git clone https://github.com/LilyDesignSystem/lily-design-system-nunjucks-headless.git
```

The components ship no CSS. Style them through the kebab-case class hook on each
root element. See the canonical
[css-style-sheet-template.css](https://github.com/LilyDesignSystem/lily-design-system/blob/main/css-style-sheet-template.css)
for a hook per component, and the 45 ready-made stylesheets in
[themes/](https://github.com/LilyDesignSystem/lily-design-system/tree/main/themes).

## License

Free open source, under your choice of MIT, Apache-2.0, GPL-2.0-only,
GPL-3.0-only, or BSD-3-Clause. See [LICENSE.md](LICENSE.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Work happens in the canonical monorepo.

---

Lily™ and Lily Design System™ are trademarks.
