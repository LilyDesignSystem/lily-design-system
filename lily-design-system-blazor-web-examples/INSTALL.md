# Install

This repository is the Blazor example application: a fully styled reference app demonstrating every catalog component.

It is published as a `git subtree` from the canonical Lily Design System™
monorepo at <https://github.com/LilyDesignSystem/lily-design-system>. Issues and pull requests are handled there.

Full documentation and the searchable component catalog: <https://lilydesignsystem.github.io/>

## Run this example application

```sh
git clone https://github.com/LilyDesignSystem/lily-design-system-blazor-web-examples.git
cd lily-design-system-blazor-web-examples
dotnet run
```

It ships three required routes — `/`, `/components` (the full searchable catalog),
and `/components/{slug}` (a live demo per component) — plus composed-page
demonstrations. The stylesheet targets Lily's kebab-case class names directly, with
no CSS-framework dependency; the current visual reference is the NHS UK design
system.

Lily is not affiliated with or endorsed by NHS.

## License

Free open source, under your choice of MIT, Apache-2.0, GPL-2.0-only,
GPL-3.0-only, or BSD-3-Clause. See [LICENSE.md](LICENSE.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Work happens in the canonical monorepo.

---

Lily™ and Lily Design System™ are trademarks.
