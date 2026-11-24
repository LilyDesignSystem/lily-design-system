---
name: lily-design-system-install
description: Installs Lily Design System for the caller's framework and chooses the matching headless, helper, identifier, and theme packages without adding an unnecessary runtime. Use when someone asks to install, set up, start with, or choose packages for Lily in Svelte, React, Vue, Angular, Solid, Blazor, Nunjucks, HTML, Web Components, or Alpine.js.
license: MIT OR Apache-2.0 OR GPL-2.0-only OR GPL-3.0-only OR BSD-3-Clause OR OGL-UK-3.0 OR CC-BY-SA-4.0
---

# Install Lily Design System

Install only the layers the application uses. Lily's headless packages provide
semantic markup, ARIA, focus management, and keyboard behaviour, but no CSS.

## 1. Identify the framework

Use the matching package and sibling skill as the source of exact imports,
peer ranges, and framework idioms:

| Framework      | Core package                                | Detailed skill                                         |
| -------------- | ------------------------------------------- | ------------------------------------------------------ |
| Svelte         | `@lilydesignsystem/svelte-headless`         | `../lily-design-system-svelte-headless-skill/`         |
| React          | `@lilydesignsystem/react-headless`          | `../lily-design-system-react-headless-skill/`          |
| Vue            | `@lilydesignsystem/vue-headless`            | `../lily-design-system-vue-headless-skill/`            |
| Angular        | `@lilydesignsystem/angular-headless`        | `../lily-design-system-angular-headless-skill/`        |
| Solid          | `@lilydesignsystem/solid-headless`          | `../lily-design-system-solid-headless-skill/`          |
| HTML           | `@lilydesignsystem/html-headless`           | `../lily-design-system-html-headless-skill/`           |
| Nunjucks       | `@lilydesignsystem/nunjucks-headless`       | `../lily-design-system-nunjucks-headless-skill/`       |
| Web Components | `@lilydesignsystem/web-components-headless` | `../lily-design-system-web-components-headless-skill/` |
| Alpine.js      | `@lilydesignsystem/alpine-headless`         | `../lily-design-system-alpine-headless-skill/`         |
| Blazor         | `LilyDesignSystem.Blazor.Headless`          | `../lily-design-system-blazor-headless-skill/`         |

For JavaScript frameworks, preserve the project's package manager and install
the package it selected, for example:

```sh
pnpm add @lilydesignsystem/react-headless
```

For Blazor:

```sh
dotnet add package LilyDesignSystem.Blazor.Headless
```

Do not claim an unpublished package is available: check the registry, or the
package's `index.md` when working from this monorepo. Alpine's package is
`@lilydesignsystem/alpine-headless`; it ships HTML snippets and one plugin, so
follow its skill for how to load them.

## 2. Add optional layers deliberately

- National personal identifiers live in a separate `*-headless-identifiers`
  package (or `.Identifiers` for Blazor). Add it only when required.
- Helpers are separate packages such as
  `@lilydesignsystem/react-theme-picker`; choose the framework helpers skill
  before installing one.
- Lily headless packages do not require a theme. For ready-made styling, link
  one standalone file from `themes/`; for product styling, target the stable
  kebab-case root classes.
- Do not install an example application as a dependency. Use it as runnable
  reference code and a CSS example.

## 3. Verify the installation

1. Import and render one small component such as `Button` using the detailed
   framework skill's documented import form.
2. Confirm the rendered root has its Lily kebab-case class.
3. Add the application's own visible text and accessible name; Lily does not
   provide English defaults.
4. If styling is expected, load exactly one theme stylesheet or application
   CSS. An unstyled component is a correct headless installation.
5. Run the application's normal typecheck, tests, and production build.

Do not invent a universal import form: the packages deliberately follow their
frameworks. For concepts and composition, use `../lily-design-system-skill/`.
