---
name: lily-design-system-nunjucks-headless-skill
description: Explains how to consume Lily Design System's Nunjucks headless component library — the macro-call idiom (a single `params` object, `classes`, `attributes`, `text`/`html`, body content via `{% call %}`/`caller()`), the camelCase-macro/kebab-case-file naming split Nunjucks forces, and server-rendering-specific notes. Use when someone asks how to import or call a Lily Nunjucks macro, wants the `params` shape for a component, needs to pass a class hook or arbitrary HTML attributes into a macro, wants to nest components (e.g. BreadcrumbNav > BreadcrumbList > BreadcrumbListItem) via `{% call %}`, or asks about Eleventy / server-side Nunjucks integration for Lily.
license: MIT OR Apache-2.0 OR GPL-2.0-only OR GPL-3.0-only OR BSD-3-Clause
---

# Lily Design System™ — Nunjucks headless macros

`lily-design-system-nunjucks-headless` is one of Lily's seven full-catalog
headless libraries: 491 accessible components as Nunjucks 3 macros, one
macro per component, zero CSS, zero bundled JavaScript. It targets WCAG 2.2
AAA and follows the same headless-layer rules as every other Lily catalog —
semantic HTML first, ARIA where semantics fall short, no visual decisions
baked in. Its directory layout mirrors the
[NHS.UK frontend](https://github.com/nhsuk/nhsuk-frontend) Nunjucks macro
pattern.

Canonical monorepo path: `lily-design-system-nunjucks-headless/`. Package
name: `lily-design-system-nunjucks-headless` (npm, once published).

## File layout

One directory per component:

```
components/{kebab-case}/macro.njk        ← the macro
components/{kebab-case}/macro.test.js    ← vitest render test
```

## Configuring Nunjucks

```js
import nunjucks from "nunjucks";

nunjucks.configure([
  "node_modules/lily-design-system-nunjucks-headless",
  "views", // your own templates
], { autoescape: true });
```

## The macro-call idiom

Every macro takes exactly **one `params` object** — never positional
arguments. Import with Nunjucks' `{% from %}`/`import`, then call:

```njk
{% from "components/button/macro.njk" import button %}

{{ button({
  text: "Save",
  type: "submit",
  label: "Save changes",
  classes: "my-custom-class"
}) }}
```

Shared `params` keys every macro recognises (component-specific params add
to this set — check the component's own `macro.njk` header comment or its
`AGENTS.md`):

| Key          | Meaning                                                                 |
| ------------ | ------------------------------------------------------------------------ |
| `text`       | Plain text content — auto-escaped.                                     |
| `html`       | Raw HTML content — rendered via the `| safe` filter. Sanitise before passing untrusted input; Nunjucks does not do it for you. |
| `label`      | Accessible name — becomes `aria-label`, or pairs with `labelledBy` where a visible heading already names the element. |
| `classes`    | Consumer-supplied extra CSS classes, appended after the kebab-case base class. This is the class-hook contract every Lily catalog shares — see `AGENTS/headless.md`. |
| `attributes` | An object of arbitrary extra HTML attributes (`id`, `data-*`, ARIA overrides) rendered as `key="value"` pairs on the root element — the Nunjucks equivalent of the rest-props pattern other frameworks spread onto the root. |

Because Nunjucks does not allow hyphens in identifiers, **macro names are
camelCase** (`button`, `breadcrumbNav`, `dataTableTH`) while **file paths
and CSS classes stay kebab-case** (`components/breadcrumb-nav/macro.njk`,
`class="breadcrumb-nav"`). This split is a Nunjucks-syntax constraint, not
a Lily naming exception — the PascalCase name in `components.tsv`
(`BreadcrumbNav`) still maps predictably to both.

## Body content: `{% call %}` / `caller()`

Components that compose (a `*Nav`/`*List`/`*ListItem` family, a
`*Table`/`*TableHead`/`*TableRow` family, anything with nested children)
take their body via Nunjucks' `{% call %}` block, which the macro reads
with `caller()`. Nesting reads the same as the composition patterns
documented in `AGENTS/components.md`:

```njk
{% from "components/breadcrumb-nav/macro.njk" import breadcrumbNav %}
{% from "components/breadcrumb-list/macro.njk" import breadcrumbList %}
{% from "components/breadcrumb-list-item/macro.njk" import breadcrumbListItem %}
{% from "components/breadcrumb-link/macro.njk" import breadcrumbLink %}

{% call breadcrumbNav({ label: "Breadcrumb" }) %}
  {% call breadcrumbList() %}
    {% call breadcrumbListItem() %}
      {{ breadcrumbLink({ href: "/", text: "Home" }) }}
    {% endcall %}
    {% call breadcrumbListItem({ current: true }) %}Today{% endcall %}
  {% endcall %}
{% endcall %}
```

A leaf macro that only needs `text`/`html` is called plainly (no
`{% call %}` needed); a container macro whose body is other components
needs `{% call %}` so `caller()` inside the macro can render that body in
place.

## Theming and class hooks

Class hooks work exactly as in every other Lily catalog: the root element
always carries the kebab-case base class, `params.classes` appends the
consumer's own class, and consumer CSS (or one of the 45 reference
`themes/*.css` stylesheets) targets the class hook. The macro itself
ships zero CSS — see `AGENTS/theme.md` for the token shape and the
forbidden-literal list that applies here exactly as it does to the other
six full-catalog headless libraries.

## Server-rendering notes

Nunjucks macros render server-side (or at build time, e.g. Eleventy) —
there is no client runtime bundled with this catalog at all, unlike a
component framework's hydration story. Everything the macro can decide it
decides at render time; anything that needs a live DOM, `matchMedia`,
`localStorage`, or `Intl` at call time is out of scope for a plain
headless macro (the `*-picker` helpers catalog is where that split shows
up explicitly — see the sibling skill below).

## Where the rest of the detail lives

- `AGENTS/nunjucks.md` — the general Nunjucks macro conventions
  (macro signature, configure snippet, security note on `params.html`)
  this file doesn't restate in full.
- `AGENTS/components.md` — the suffix→HTML-element mapping and the
  compound name-family composition patterns (`*List`/`*ListItem`,
  `*Nav`/`*List`/`*ListItem`, table sub-elements, etc.) that this
  catalog's macros follow one-to-one.

## When NOT this skill

- Questions about the six `*-picker` helper packages (`theme-picker`,
  `locale-picker`, `text-size-picker`, `motion-picker`, `share-picker`,
  `date-time-picker`) — those are a separate catalog with their own
  macro-plus-client.js split; use
  `lily-design-system-nunjucks-helpers-skill`.
- General Lily concepts, terminology, or the headless-vs-example split
  that apply across all seven frameworks — use `lily-design-system-skill`.
