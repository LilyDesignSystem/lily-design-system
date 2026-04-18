# Lily Design System — Nunjucks Headless — Implementation Plan

## Goal

Implement all Lily Design System components as headless Nunjucks macros.
Every component is a reusable Nunjucks macro that emits semantic HTML,
has zero CSS, is WCAG 2.2 AAA accessible, internationalisation-ready,
and has an automated rendering test.

Inspired by the NHS.UK frontend design system, which distributes its
components as Nunjucks macros (one `macro.njk` per component) consumed
via `{% from "component/macro.njk" import component %}`.

## Inspirations

- [Nunjucks — Mozilla](https://mozilla.github.io/nunjucks/)
- [Nunjucks templating docs](https://mozilla.github.io/nunjucks/templating.html)
- [Nunjucks API docs](https://mozilla.github.io/nunjucks/api.html)
- [NHS.UK Design System — Components](https://service-manual.nhs.uk/design-system/components/)
- [NHS.UK frontend repository](https://github.com/nhsuk/nhsuk-frontend)
- Sibling subproject: `lily-design-system-html-headless`
- Sibling subproject: `lily-design-system-svelte-headless`

## Technology

- Template engine: Nunjucks 3.x (`nunjucks` npm package)
- Runtime: Node.js (LTS)
- Package manager: PNPM
- Test framework: Vitest
- DOM assertion helper: `jsdom` (parse rendered string, query elements)
- Component file extension: `.njk`
- Test file extension: `.test.js`
- Component directory: `components/`

## Directory structure

```
lily-design-system-nunjucks-headless/
├── AGENTS.md                       # project instructions for agents
├── CLAUDE.md                       # symlink / reference to AGENTS.md
├── AGENTS/                         # shared AGENTS doc references
│   ├── components.md               # canonical component list
│   ├── accessibility.md
│   ├── internationalization.md
│   ├── headless.md
│   └── nunjucks.md                 # Nunjucks-specific conventions
├── README.md                       # symlink to index.md
├── index.md                        # project overview
├── nunjucks-plan.md                # this file
├── tasks.md                        # task checklist
├── package.json                    # pnpm + nunjucks + vitest + jsdom
├── pnpm-lock.yaml
├── vitest.config.js
├── test/
│   └── render.js                   # shared Nunjucks render helper
└── components/
    ├── button/
    │   ├── macro.njk               # the button macro
    │   └── macro.test.js           # Vitest render test
    ├── badge/
    │   ├── macro.njk
    │   └── macro.test.js
    └── …                           # all 332 canonical components,
                                    # one directory per component,
                                    # matching the NHS.UK frontend layout
```

## Component architecture

### File convention

- One macro per `macro.njk` file.
- Directory name: `components/{component-kebab-case}/`.
- File path: `components/{component-kebab-case}/macro.njk`.
- Test path: `components/{component-kebab-case}/macro.test.js`.
- Macro name: `{componentCamelCase}` (hyphens are not valid in
  Nunjucks macro identifiers — so we use camelCase for the macro
  name while the directory and CSS class stay kebab-case).
- CSS class on the root element: the kebab-case component name.
- Consumer additions: `params.classes` is appended after the base class.
- This directory layout matches the NHS.UK frontend exactly, so
  imports look and feel the same:
  `{% from "components/button/macro.njk" import button %}`.

### Macro signature

Every macro takes a single `params` options object:

```njk
{%- macro button(params) -%}
<button
  class="button {{ params.classes | default('') }}"
  type="{{ params.type | default('button') }}"
  {%- if params.id %} id="{{ params.id }}"{% endif %}
  {%- if params.disabled %} disabled{% endif %}
  {%- if params.attributes %}{% for k, v in params.attributes %} {{ k }}="{{ v }}"{% endfor %}{% endif %}
  aria-label="{{ params.label | default('') }}"
>
  {%- if params.html -%}
    {{ params.html | safe }}
  {%- else -%}
    {{ params.text }}
  {%- endif -%}
</button>
{%- endmacro -%}
```

### Shared parameter conventions (learned from NHS.UK frontend)

| Param         | Type    | Purpose                                                    |
| ------------- | ------- | ---------------------------------------------------------- |
| `text`        | string  | Plain text content (escaped)                               |
| `html`        | string  | Raw HTML content (not escaped, use `\| safe`)              |
| `label`       | string  | Accessible name (ARIA label)                               |
| `description` | string  | Accessible description                                     |
| `id`          | string  | Element id                                                 |
| `classes`     | string  | Consumer-provided additional CSS classes                   |
| `attributes`  | object  | Arbitrary additional HTML attributes as key/value          |
| `caller()`    | content | Nunjucks `{% call %}` block for slot-like child content    |

Component-specific params are added on top: `href`, `value`, `type`,
`name`, `min`, `max`, `step`, `placeholder`, `required`, `autocomplete`,
`pattern`, etc., mirroring the underlying HTML element.

### Calling convention

Consumers import and call macros in two styles:

```njk
{# simple text content #}
{% from "components/button/macro.njk" import button %}
{{ button({ text: "Save", type: "submit", label: "Save changes" }) }}

{# richer HTML child content via call block #}
{% from "components/card/macro.njk" import card %}
{% call card({ label: "Patient summary" }) %}
  <h2>John Smith</h2>
  <p>DOB: 1980-01-01</p>
{% endcall %}
```

### Headless rules (non-negotiable)

- **No CSS**: no `<style>`, no stylesheet, no inline `style`.
- **No colours, sizes, spacing, visual treatment**.
- **No icons, images, fonts** bundled into macros (consumers supply).
- **No JavaScript** bundled into macros; interactivity is expressed
  through semantic HTML + ARIA only. Consumers add behaviour.
- **No CSS framework**: no Tailwind, no DaisyUI, no Bootstrap.
- **No hardcoded strings**: every human-readable string comes from
  params. Macros must be internationalisation-ready.
- **Only one base CSS class per component** = the kebab-case name.
- **Semantic HTML first**: use `<button>`, `<nav>`, `<table>`, `<dialog>`,
  `<progress>`, `<meter>`, etc. Do not use `<div>` when a semantic
  element exists.

### Accessibility rules

- WCAG 2.2 AAA.
- WAI-ARIA Authoring Practices patterns.
- Standard attribute conventions:
  - `<label for="id">` linkage
  - `aria-labelledby` / `aria-describedby`
  - `aria-invalid` + `aria-errormessage`
  - `role="alert"`, `role="group"`, `role="status"` where appropriate
  - Roving tabindex for grids
  - `aria-pressed`, `aria-expanded`, `aria-current`, `aria-selected`
- Focus indicators are the consumer's responsibility (headless), but
  macros must not block default focus outlines (no `outline: none`).

### Internationalisation rules

- All text content through params.
- Labels, placeholders, error messages, hint text, aria-labels:
  all configurable by the consumer.

## Test architecture

### Render helper

`test/render.js`:

```js
import nunjucks from 'nunjucks'
import { JSDOM } from 'jsdom'

const env = nunjucks.configure('.', {
  autoescape: true,
  throwOnUndefined: false,
  trimBlocks: true,
  lstripBlocks: true,
})

export function render(componentName, params = {}) {
  const macro = toMacroName(componentName)
  const src = `{% from "components/${componentName}/macro.njk" import ${macro} %}`
          + `{{ ${macro}(params) }}`
  const html = env.renderString(src, { params })
  const dom = new JSDOM(html)
  return { html, document: dom.window.document }
}

function toMacroName(kebab) {
  return kebab.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}
```

### Test shape

Each component test asserts:

1. Root element uses the correct HTML tag.
2. Root element has the correct base CSS class.
3. `params.classes` is appended to the class list.
4. `params.attributes` are rendered as HTML attributes.
5. `params.label` becomes the accessible name.
6. `params.text` is escaped; `params.html` is not.
7. Component-specific params render the expected markup.

Example:

```js
import { describe, it, expect } from 'vitest'
import { render } from '../test/render.js'

describe('button', () => {
  it('renders a <button> with base class', () => {
    const { document } = render('button', { text: 'Save' })
    const el = document.querySelector('button')
    expect(el).toBeTruthy()
    expect(el.classList.contains('button')).toBe(true)
    expect(el.textContent.trim()).toBe('Save')
  })

  it('appends consumer classes', () => {
    const { document } = render('button', { text: 'Save', classes: 'extra' })
    const el = document.querySelector('button.button.extra')
    expect(el).toBeTruthy()
  })

  it('uses params.label as aria-label', () => {
    const { document } = render('button', { text: 'x', label: 'Close dialog' })
    expect(document.querySelector('button').getAttribute('aria-label'))
      .toBe('Close dialog')
  })
})
```

### Test command

- `pnpm test` → `vitest run`

## Component inventory

The canonical list of **332** components lives in the shared
`AGENTS.md` at the repo root and is duplicated into this subproject's
`AGENTS/components.md`. The Nunjucks implementation must deliver every
component in that list, 1:1, with no omissions and no additions.

## Approach

1. **Project infrastructure**
   - `package.json` (nunjucks, vitest, jsdom)
   - `pnpm install`
   - `vitest.config.js`
   - `test/render.js` helper
   - `AGENTS.md`, `CLAUDE.md`, `index.md`, `README.md` symlink
   - Copy/symlink `AGENTS/` shared docs
2. **First-light verification**
   - Implement `button.njk` + `button.test.js`.
   - Run `pnpm test` and confirm green. This validates the full
     toolchain end-to-end before mass authoring.
3. **Bulk component implementation in priority order** (mirrors the
   html-headless project):
   a. Static wrappers (badge, banner, card, panel, alert, …)
   b. Form inputs (text-input, email-input, checkbox-input, …)
   c. Links and views (action-link, postal-code-view, …)
   d. Vital sign views and inputs (16 view/input pairs)
   e. Table families (table, data-table, calendar-table, gantt-table,
      kanban-table — 7 parts each)
   f. Navigation patterns (accordion-nav, breadcrumb-nav, tree-nav, …)
   g. List patterns (check-list, summary-list, task-list, …)
   h. Bar patterns (tab-bar, menu-bar, tool-bar, task-bar)
   i. Picker patterns (color-picker, five-star-rating-picker, …)
   j. Form composition (form, field, fieldset, error-summary)
   k. Overlays and menus (dialog, popover, tooltip, dropdown-menu)
   l. Layout (grail-layout + 5 slots, sidebar, floating-panel, …)
   m. Interactive specialty (combobox, carousel, slider, signature-pad)
4. **Cross-check** every delivered component against the canonical
   list; fail the build if any are missing.
5. **Full test run**: `pnpm test` must pass.

### Implementation priority

- Infrastructure first.
- Then proceed alphabetically within each priority tier.
- Batch size: as many components as possible per session.

## Acceptance criteria

- [ ] All 332 components from the canonical list are implemented as
      Nunjucks macros.
- [ ] Each component file follows the architecture above.
- [ ] Every component has a corresponding `.test.js` file.
- [ ] All tests pass: `pnpm test`.
- [ ] Zero CSS in any component — fully headless.
- [ ] Zero JavaScript bundled in any `.njk` file.
- [ ] WCAG 2.2 AAA compliant (ARIA attributes, keyboard semantics).
- [ ] No hardcoded user-facing strings (internationalisation-ready).
- [ ] Base CSS class on every component matches the kebab-case name.
- [ ] `params.classes` is appended on every component.
- [ ] `params.attributes` is rendered on every component.
- [ ] `package.json` name is `lily-design-system-nunjucks-headless`.

## Lessons borrowed from NHS.UK frontend

- **Single `params` object** — one positional arg keeps signatures
  stable as components gain features over time.
- **`text` vs `html`** — dual parameter pattern lets consumers choose
  between escaped text and raw HTML; always prefer `text`.
- **`classes` + `attributes`** — the standard escape hatches consumers
  need to style and hook into components without the library having
  to anticipate every use case.
- **`call` block for slot content** — richer children go through a
  `{% call component(params) %}…{% endcall %}` wrapper, handled inside
  the macro via `{{ caller() }}`.
- **One macro per file, named `macro.njk` inside a component
  directory named for the component** — matches NHS.UK exactly, so
  `{% from "components/x/macro.njk" import x %}` is trivially
  predictable and consumers who already know NHS.UK frontend feel at
  home.

## Deviations from NHS.UK

- **Zero CSS** (NHS.UK ships a full visual design system; we are
  headless).
- **No bundled JavaScript** (NHS.UK ships `data-module` + JS; we
  leave behaviour to the consumer).
- **332 components** vs NHS.UK's 36; the Lily canonical list is a
  superset covering medical, layout, navigation, pickers, tables,
  vitals, regional identifiers, etc.

## Timeline

- No specific deadline.
- No preferred timeline.

## Titles

- PackagePascalCase: `LilyNunjucksHeadless`
- package-kebab-case: `lily-design-system-nunjucks-headless`
- package_snake_case: `lily_nunjucks_headless`
