---
name: lily-design-system-theme
description: Customizes an application's Lily styling or authors a canonical Lily reference theme from DTCG tokens, class hooks, and the repository's accessibility gates. Use when someone asks to style Lily components, choose or override a theme, edit design tokens, create a theme, or validate theme contrast and interaction states.
license: MIT OR Apache-2.0 OR GPL-2.0-only OR GPL-3.0-only OR BSD-3-Clause
---

# Theme Lily Design System

First decide whether this is application styling or a new canonical reference
theme. The two workflows have different ownership and verification.

## Application styling

1. Load one standalone stylesheet from `themes/`, or write product CSS against
   each component's stable kebab-case root class.
2. Override documented `--lily-*` variables where available. Do not depend on
   undocumented descendants; the root class is the universal styling contract.
3. Keep selectors low-specificity so the application can override them.
4. Provide visible focus, hover, active, disabled, selected, invalid, forced
   colours, reduced motion, and increased-contrast states.
5. Keep responsive behaviour in CSS: mobile first, logical properties, no page
   overflow at 320 CSS pixels, and no text below `1rem`.

Headless packages never require or inject a theme. Loading no stylesheet is a
valid choice.

## Canonical reference-theme authoring

Read `AGENTS/theme.md`, `AGENTS/responsive.md`, and `spec/theme/index.md`
before editing.

1. Establish the theme's source, licence, permitted assets, typeface status,
   date, and provenance. Do not copy protected marks or unlicensed code.
2. Add or edit primitives in `themes/tokens/{slug}.json`, using strict DTCG
   2025.10 `color`, `dimension`, and `number` types. Put Lily-only data below
   `$extensions["com.lilydesignsystem"]`.
3. Run `bin/generate-theme-tokens`. The generated primitive block in
   `themes/{slug}.css` is output; do not hand-edit it.
4. Author the derived `--lily-*` layer and component rules with
   `:where(...)`. Preserve every pinned section required by `bin/check-theme`.
5. For a public-sector reference, update `themes/references.tsv` and
   `themes/identity-changes.tsv`. Update the resolver and every documented
   theme list through the repository generators rather than copying stale
   counts.

## Validate

```sh
bin/generate-theme-tokens --check
bin/check-dtcg-tokens
bin/check-theme --contrast --gate
bin/check-theme-references --offline
```

Then run `bin/test`, the relevant example-app accessibility/responsive tests,
and visual regression when the reference appearance changes. Contrast passing
does not replace keyboard, zoom, forced-colours, or real-content review.
