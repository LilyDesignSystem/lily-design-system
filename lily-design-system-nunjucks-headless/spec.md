# Lily Design System — Nunjucks Headless — Specification

Living specification for the Nunjucks-macro headless implementation of the
Lily Design System. Single source of truth for spec-driven development of
this subproject. For project-wide rules, read the root [spec.md](../spec.md)
first.

This file adds Nunjucks-specific detail and tracks the implementation status
of the **492 canonical components** in this framework.

---

## 1. Role in the ecosystem

This subproject ships Nunjucks 3.x macros for every component in the Lily
catalog. Every macro is **headless**: zero CSS, semantic HTML, ARIA only.
Consumers `{% import %}` the macros into their own Nunjucks templates and
bring their own CSS. The sibling subproject
`lily-design-system-nunjucks-eleventy-examples/` consumes this library via a
shared Nunjucks `FileSystemLoader` search path and renders it with
NHS-aligned CSS.

This library has no host coupling — it works with any Nunjucks 3.x
environment (Eleventy, Express, custom Node, Mozilla docs builds).

## 2. Scope

### In scope

- One Nunjucks macro per component (492 macros total).
- vitest + jsdom render tests per component.
- Macro names are camelCase (Nunjucks does not allow hyphens in identifiers);
  paths and CSS classes stay kebab-case.

### Explicitly out of scope

- CSS, stylesheets, fonts, icons, images.
- Hardcoded text — all content via macro `params`.
- JavaScript runtime — macros render static HTML; interactivity is the
  consumer's concern.
- Build tools — macros are read directly by Nunjucks.

## 3. Architecture

### Framework + tooling

| Concern             | Choice                                      |
| ------------------- | ------------------------------------------- |
| Template engine     | Nunjucks 3.x                                |
| Language            | JavaScript (for tests)                      |
| Package manager     | pnpm                                        |
| Test runner         | vitest + jsdom                              |
| i18n                | none — consumer-supplied via `params`       |

### Nunjucks conventions

- Macro names are camelCase (`button`, `breadcrumbNav`, `dataTableTH`).
- File paths and CSS classes are kebab-case (`components/button/macro.njk`,
  `class="button"`).
- Each macro accepts a single `params` options object.
- Shared param keys: `text`, `html`, `label`, `classes`, `attributes`,
  plus component-specific params.
- `params.text` is plain text (auto-escaped).
- `params.html` is raw HTML (rendered via `| safe`); consumers must sanitise
  to prevent XSS.

### File layout

```
lily-design-system-nunjucks-headless/
├── components/
│   └── {kebab-case}/
│       ├── macro.njk                      ← the Nunjucks macro
│       ├── macro.test.js                  ← vitest render test
│       ├── index.md, README.md, AGENTS.md,
│       │   CLAUDE.md, plan.md, tasks.md
├── test/render.js                         ← shared render helper
├── vitest.config.js
└── package.json
```

## 4. Per-component contract

Each component directory `components/{kebab-case}/` requires:

- `macro.njk` — the Nunjucks macro.
- `macro.test.js` — vitest spec.
- `index.md`, `README.md` (symlink), `AGENTS.md`, `CLAUDE.md`, `plan.md`,
  `tasks.md` — documentation.

### Macro source template

```njk
{# components/{kebab-case}/macro.njk #}
{%- macro {camelCase}(params) -%}
<{tag}
  class="{kebab-case-base} {{ params.classes | default('') }}"
  {%- if params.label %} aria-label="{{ params.label }}"{% endif %}
  {%- if params.attributes %}{% for k, v in params.attributes %} {{ k }}="{{ v }}"{% endfor %}{% endif %}
>
  {%- if params.html -%}
    {{ params.html | safe }}
  {%- else -%}
    {{ params.text }}
  {%- endif -%}
</{tag}>
{%- endmacro -%}
```

The HTML tag is the canonical tag from the root
[`AGENTS/components.md`](../AGENTS/components.md) suffix-to-tag mapping.

### Consumer usage

```njk
{% from "components/button/macro.njk" import button %}

{{ button({
  text: "Submit",
  label: "Submit the contact form"
}) }}
```

### Nunjucks configuration

```js
nunjucks.configure([
  'components',          // Lily's nunjucks-headless components/ directory
  '<YOUR-VIEWS-FOLDER>'  // consumer's templates
])
```

## 5. Testing

### 5.1 Stack

- vitest with jsdom (parses rendered HTML).
- A shared `test/render.js` helper that instantiates Nunjucks, imports the
  macro, calls it with `params`, and returns the rendered string + parsed
  DOM.
- Run via `pnpm test`.

### 5.2 Per-component test minimums

Each `macro.test.js` asserts:

1. The macro renders the canonical HTML tag.
2. The root element carries the kebab-case base class.
3. `params.classes` appends correctly.
4. `params.label` reflects to `aria-label`.
5. `params.attributes` flatten onto the root element.
6. `params.text` is escaped; `params.html` is rendered raw via `| safe`.

## 6. Commands

```sh
pnpm install                         # install dev dependencies
pnpm test                            # run vitest
pnpm exec vitest run                 # explicit one-shot run
```

## 7. Acceptance criteria

### 7.1 Catalog parity

- [ ] All 492 canonical components have a `components/{kebab-case}/`
      directory.
- [ ] Each directory has `macro.njk`, `macro.test.js`, and the 6 documentation
      files (`index.md`, `README.md` symlink, `AGENTS.md`, `CLAUDE.md`,
      `plan.md`, `tasks.md`).
- [ ] Every macro uses the canonical HTML tag.
- [ ] Every macro sets the kebab-case base class on the root element.

### 7.2 Accessibility

- [ ] WCAG 2.2 AAA across every macro.
- [ ] Required `params.label` enforced where text alone is insufficient.
- [ ] ARIA attributes documented in `AGENTS.md` are produced.

### 7.3 Testing

- [ ] Every component has a `macro.test.js`.
- [ ] `pnpm test` passes.
- [ ] Tests validate HTML escaping vs. `| safe` for `params.html`.

### 7.4 Internationalisation

- [ ] No hardcoded user-facing strings inside `macro.njk`.
- [ ] All text via `params.text` / `params.html`.

### 7.5 Security

- [ ] `params.html` is rendered via `| safe` — consumers must sanitise
      input to prevent cross-site scripting.

## 8. Implementation status

### 8.1 Done

- [x] Project infrastructure (`package.json`, `vitest.config.js`,
      `test/render.js`).
- [x] AGENTS.md, CLAUDE.md, index.md, README.md (symlink), plan.md, tasks.md.
- [x] All 492 canonical components have a `components/{kebab-case}/` directory
      with `macro.njk` (per audit).

### 8.2 Verified

- [x] Every component has a `macro.test.js` (**492 / 492**).
- [x] `pnpm test` passes: **2,393 / 2,393 tests, zero failures**.
- [x] CSS class-name audit: **492 / 492** macros reference their canonical
      kebab-case base class.

### 8.3 Open backlog

(none — all listed items verified)

## 9. Prohibited

| Prohibition                       | Reason                              |
| --------------------------------- | ----------------------------------- |
| `<style>`, `<link rel="stylesheet">` | headless: zero CSS               |
| Tailwind, DaisyUI, Bootstrap      | no CSS framework dependency         |
| Bundled fonts, images, icons      | consumer supplies all assets        |
| Hardcoded user-facing strings     | i18n is the consumer's concern      |
| Raw `params.html` without sanitise | XSS risk                           |
| Hyphenated macro names            | Nunjucks disallows; use camelCase   |

## 10. Tracking

- Package: `lily-design-system-nunjucks-headless`
- Version: 0.2.0
- Template engine: Nunjucks 3.x
- Test runner: vitest + jsdom
- Package manager: pnpm
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause
- Contact: Joel Parker Henderson <joel@joelparkerhenderson.com>
- Canonical catalog: [../components.tsv](../components.tsv) — 492 components
- Root spec: [../spec.md](../spec.md)
- Sibling example app: [../lily-design-system-nunjucks-eleventy-examples/](../lily-design-system-nunjucks-eleventy-examples/)
