# Lily Design System - Nunjucks Example

A browsable example website that demonstrates every Lily Design System
component rendered through the
[`lily-design-system-nunjucks-headless`](../lily-design-system-nunjucks-headless)
macros and dressed in the NHS UK Design System's look and feel.

## What it is

- A static site built with [Eleventy](https://www.11ty.dev/)
- Every Lily component styled with CSS that recreates NHS UK visual
  tokens: colours, typography, spacing, focus state, page template
- One demo page per component, plus composed page templates showing
  components working together
- Zero framework coupling — the output is plain HTML + CSS + a tiny
  bit of progressive-enhancement JavaScript

## What it demonstrates

- How to consume the headless Nunjucks macros in a real project
- How to configure Nunjucks with an additional `FileSystemLoader`
  path so macros from a peer package resolve transparently
- How to theme Lily's class names (e.g. `.button`, `.alert`,
  `.care-card`) to match a specific visual language — in this case,
  NHS UK
- How to structure a design-system documentation site with demo
  pages, composed templates, and an accessible page template

## Prerequisites

- Node.js 20+
- PNPM

## Commands

```bash
pnpm install
pnpm dev     # Eleventy dev server on http://localhost:8080
pnpm build   # produce static site in _site/
pnpm test    # Vitest
```

## Source of components

This project imports components from its sibling subproject:

```njk
{% from "components/button/macro.njk" import button %}
{{ button({ text: "Save", type: "submit" }) }}
```

The Eleventy config adds `../lily-design-system-nunjucks-headless` to
the Nunjucks search path, so the import above resolves to the
headless macro file without any copy-in step.

## NHS UK references

- [NHS UK Design System](https://service-manual.nhs.uk/design-system)
- [Styles — Page Template](https://service-manual.nhs.uk/design-system/styles/page-template)
- [Styles — Typography](https://service-manual.nhs.uk/design-system/styles/typography)
- [Styles — Focus State](https://service-manual.nhs.uk/design-system/styles/focus-state)
- [NHS Identity — Colours](https://www.england.nhs.uk/nhsidentity/identity-guidelines/colours/)
- [NHS UK frontend repository](https://github.com/nhsuk/nhsuk-frontend)

## Related projects

- [Lily Design System](../) — parent project
- [Nunjucks Headless](../lily-design-system-nunjucks-headless/) —
  the headless component library this site styles
- [HTML Headless](../lily-design-system-html-headless/)
- [Svelte Headless](../lily-design-system-svelte-headless/)

## License

MIT or Apache-2.0 or GPL-2.0 or GPL-3.0, or contact us for more.

## Contact

Joel Parker Henderson (joel@joelparkerhenderson.com)
