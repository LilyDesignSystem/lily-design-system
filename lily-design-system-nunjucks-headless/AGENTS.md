# Lily Design System - Nunjucks Headless

@AGENTS/lily.md
@AGENTS/components.md
@AGENTS/accessibility.md
@AGENTS/internationalization.md
@AGENTS/headless.md
@AGENTS/nunjucks.md
@AGENTS/theme.md
@AGENTS/nhs-uk-design-system-references.md

## Metadata

- Package: lily-design-system-nunjucks-headless
- Version: 0.1.0
- Created: 2026-04-18
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause or contact us for more
- Contact: Joel Parker Henderson (joel@joelparkerhenderson.com)

## IMPORTANT component architecture

- Nunjucks 3.x macros
- One macro per component, in its own directory
- File path: `components/{component-kebab-case}/macro.njk`
- Test path: `components/{component-kebab-case}/macro.test.js`
- Directory layout matches NHS.UK frontend exactly
- Macro takes a single `params` options object
- Shared param keys: `text`, `html`, `label`, `classes`, `attributes`
- Headless design: no CSS, no styles — consumers provide all styling
- No bundled JavaScript — consumers provide all behaviour
- Input/View pattern for paired -Input/-View components
- Macro names are camelCase (Nunjucks does not allow hyphens in
  identifiers); file paths and CSS classes stay kebab-case
- Set root-element class using the kebab-case component name
- All tasks reference `spec/index.md` for implementation details

## NO

- No frameworks (no React, no Svelte, no Vue, no Angular, no Blazor)
- No bundled JavaScript in any `.njk` file
- No build tools beyond pnpm + Vitest
- No CSS or styles — consumers provide all styling
- No images, icons, or fonts
- No Tailwind, no DaisyUI, no Bootstrap
- No hardcoded user-facing strings

## Component file structure

Each component lives in its own directory:

- `components/{component-kebab-case}/macro.njk` — the Nunjucks macro
- `components/{component-kebab-case}/macro.test.js` — Vitest render test

## Component success checklist

- **Macro signature**: accepts a single `params` options object
- **Base class**: root element has `class="{kebab-case}"` with
  `params.classes` appended
- **Attributes**: `params.attributes` is rendered on the root element
- **Accessible name**: `params.label` becomes the aria-label (or is
  linked via `aria-labelledby`)
- **Content**: `params.text` is escaped, `params.html` is rendered raw
- **Keyboard semantics**: correct HTML element so browser default
  keyboard behaviour applies
- **Screen reader**: correct ARIA roles, states, properties
- **WCAG 2.2 AAA**: tested compliance
- **Semantic HTML**: proper use of semantic elements

## Component granularity

- If a directory represents a compound pattern, stop and ask for help.
- Each component must live in its own directory.
- No sub-components within the same `macro.njk` file.

### Headless component scope

- Semantic HTML
- ARIA attributes
- `params.attributes` for arbitrary extra attributes
- No visual styling
- No bundled JavaScript
- Consumers bring all their own CSS and behaviour

## Titles

- PackagePascalCase: `LilyNunjucksHeadless`
- package-kebab-case: `lily-design-system-nunjucks-headless`
- package_snake_case: `lily_nunjucks_headless`

## Helpers

- List components: `Bash(find components -type d -depth 1 -exec basename {} \; | sort)`

## Testing

- Vitest: https://vitest.dev/
- jsdom for DOM assertions on rendered HTML
- Shared render helper: `test/render.js`
- Test command: `pnpm test` (runs `vitest run`)

## Accessibility

- Semantic HTML, alt text, link text, form labels, scoping, table
  row headings, table column headings
- Provide keyboard navigation, screen readers, color contrast, etc.
- Web Content Accessibility Guidelines (WCAG) 2.2 AAA
- Accessible Rich Internet Applications (ARIA) attributes
- ARIA pattern references: Mapping to WAI-ARIA Authoring Practices

## Internationalization

- Never hardcode user-facing strings
- All text content comes through macro params
- Labels, placeholders, error messages are all configurable

## Template

```njk
{# components/{component-kebab-case}/macro.njk #}
{#
  ComponentPascalCase macro

  Description: {comprehensive description}
  HTML tag: <tag>
  CSS class: component-kebab-case

  Params:
    text         — string. Plain text content (escaped).
    html         — string. Raw HTML content (rendered via `| safe`).
    label        — string. Accessible name (aria-label).
    classes      — string. Consumer-provided extra CSS classes.
    attributes   — object. Extra HTML attributes as key/value.
    …component-specific params

  Usage:
    {% from "components/component-kebab-case/macro.njk" import componentCamelCase %}
    {{ componentCamelCase({
      text: "Example",
      label: "Example label"
    }) }}
#}

{%- macro componentCamelCase(params) -%}
<tag
  class="component-kebab-case {{ params.classes | default('') }}"
  {%- if params.id %} id="{{ params.id }}"{% endif %}
  {%- if params.label %} aria-label="{{ params.label }}"{% endif %}
  {%- if params.attributes %}{% for k, v in params.attributes %} {{ k }}="{{ v }}"{% endfor %}{% endif %}
>
  {%- if params.html -%}
    {{ params.html | safe }}
  {%- else -%}
    {{ params.text }}
  {%- endif -%}
</tag>
{%- endmacro -%}
```

## Implementation plan

- Implementation priority: infrastructure first, then proceed
  alphabetically within each priority tier (see `spec/index.md`)
- Batch size: implement as many components as possible per session

## Timeline

- No specific deadline.
- No preferred timeline.

## Verify

Run `pnpm test`.
