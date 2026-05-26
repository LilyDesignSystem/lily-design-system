# AreaChart — Implementation Plan

## Goal

Implement the AreaChart component: an area chart visualization showing sized components in continuous data.

## HTML Tag and CSS Class

- HTML tag: `<figure>`
- CSS class: `.area-chart`

## Approach

1. Render `<figure>` as the root element with `class="area-chart"`
2. Wire ARIA attributes per the AGENTS.md ARIA section
3. Wire keyboard behaviour per the AGENTS.md Keyboard section
4. Spread `restProps` for consumer customization
5. Implement headless variants in HTML, Svelte, React, Vue, Blazor, and Nunjucks subprojects
6. Author tests for each implementation

## Acceptance Criteria

- [ ] Renders `<figure>` with class `area-chart`
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] All ARIA attributes documented in AGENTS.md are applied
- [ ] All keyboard interactions documented in AGENTS.md work as described
- [ ] Tests pass in all six headless implementations
