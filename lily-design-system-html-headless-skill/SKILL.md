---
name: lily-design-system-html-headless-skill
description: Explains how to consume Lily Design System's plain-HTML headless component library — copying semantic HTML/ARIA snippet files with an embedded vanilla-JS behavior layer, no build step, no framework runtime. Use when someone asks how to use Lily's HTML (vanilla) headless components, wants the no-framework/no-build usage idiom, needs to wire up a component's inline `<script>` IIFE, asks what the component's HTML comment header documents, or asks how HTML headless differs from the Web Components headless catalog.
license: MIT OR Apache-2.0 OR GPL-2.0-only OR GPL-3.0-only OR BSD-3-Clause
---

# Lily Design System™ — HTML headless usage

`lily-design-system-html-headless` is the plain-HTML implementation of Lily's
canonical component catalog: annotated semantic-HTML snippet files with ARIA
and class hooks, plus an embedded vanilla-JS behavior layer where a component
needs interactivity. Zero CSS, zero framework, zero build step to *use* a
component. It is one of the seven canonical, full-catalog (491/491) headless
libraries — HTML, Svelte, React, Vue, Angular, Blazor, Nunjucks — each
implementing the same slugs, props/attributes, and ARIA/keyboard contracts.
It is also the **reference implementation**: the canonical semantic HTML,
ARIA, and keyboard behaviour that every other framework binding mirrors.

Root of the ecosystem: [../spec/index.md](../spec/index.md). The general Lily
concepts skill: [../lily-design-system-skill/](../lily-design-system-skill/).

## What ships, and how

Each component is one self-contained file, `components/{kebab-case}.html`.
It opens with an HTML comment documenting the component name, description,
canonical HTML tag, CSS class, keyboard contract, and accessibility notes,
followed by a usage example — then the markup itself, and, only where the
component needs interactivity, an embedded `<script>` block:

```html
<!-- button.html -->
<!-- Button component
  Description: a generic clickable button element
  HTML tag: <button>
  CSS class: button
  Keyboard: Tab to focus, Enter or Space to activate
  Accessibility: Implicit button role, aria-label for accessible name
  Usage:
    <button class="button" aria-label="Example">
      ...
    </button>
-->

<button class="button" aria-label="">
  <!-- Consumer provides button content -->
</button>
```

Components with internal state or keyboard behaviour wrap that behaviour in
an IIFE (`(function () { "use strict"; ... })();`) that reads/writes `data-*`
attributes and ARIA state directly on the markup — no module loader, no
polyfills, only standard browser APIs.

**Consuming a component**: copy the snippet into your page, or fetch/include
it server-side (Eleventy, Astro, a template include, a static build step —
whatever your stack already does with HTML files). There is no package
import step to render a component and no bundler required to use one: no
TypeScript, no JSX, no framework runtime. The package itself (dev-only
tooling: WebDriverIO tests, Storybook, a small node helper) is published to
npm for teams that want to read the source or script the copy step, but
nothing about *rendering* a component requires installing it.

## Theming and class hooks

Same contract as every other Lily catalog: the first attribute on a
component's root element is its kebab-case base class plus the consumer's
own class hook (`class="{slug} {your-class}"`), and that base class is the
*only* styling contract — no bundled CSS, fonts, icons, or images. Consumer
CSS targets the class directly; there is no `nhsuk-`-style prefix and no CSS
framework dependency. See [../AGENTS/theme.md](../AGENTS/theme.md) and
[../AGENTS/headless.md](../AGENTS/headless.md) for the full rules this
catalog follows.

## Naming, suffixes, composition

The suffix→HTML-element mapping (`-button` → `<button>`, `-nav` → `<nav>`,
`-table` family → the table elements, `-dialog` → `<dialog>`, etc.) and the
compound name-family patterns (`*List`/`*ListItem`, `*Nav`/`*List`/
`*ListItem`, `*Picker`/`*PickerButton`, table sub-elements, and more) are
catalog-wide and documented once, not restated here: see
[../AGENTS/components.md](../AGENTS/components.md). The worked composition
examples there (Form, Grail layout, Navigation, Table) use JSX for brevity,
but the HTML shape is the same nesting with plain tags and the kebab-case
classes shown above.

## When this isn't the right skill

- **The `*-picker` helpers** (theme, locale, text-size, motion, share,
  date-time) are a separate layer with their own web-component packaging —
  use [`lily-design-system-html-helpers-skill`](../lily-design-system-html-helpers-skill/).
- **The native-custom-element sibling catalog** — `lily-design-system-web-components-headless`
  ships 456 of the 491 components (its full achievable scope) as autonomous custom elements
  with no framework runtime, a separate subproject (not this one) — use
  `lily-design-system-web-components-headless-skill` for that catalog's
  own conventions.
- **General Lily concepts** (what "headless" means, the catalog at a glance,
  picking a framework, terminology) that aren't specific to the plain-HTML
  idiom — use [`lily-design-system-skill`](../lily-design-system-skill/).
