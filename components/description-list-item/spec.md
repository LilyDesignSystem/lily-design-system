# DescriptionListItem — Specification

Single source of truth for spec-driven development of the DescriptionListItem component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the DescriptionListItem component: one key-value pair in a description list using dt and dd elements.

## HTML Tag and CSS Class

- HTML tag: `<div>`
- CSS class: `.description-list-item`

## Approach

1. Render `<div>` as the root element with `class="description-list-item"`
2. Wire ARIA attributes per the AGENTS.md ARIA section
3. Wire keyboard behaviour per the AGENTS.md Keyboard section
4. Spread `restProps` for consumer customization
5. Implement headless variants in HTML, Svelte, React, Vue, Blazor, and Nunjucks subprojects
6. Author tests for each implementation

## Acceptance Criteria

- [ ] Renders `<div>` with class `description-list-item`
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] All ARIA attributes documented in AGENTS.md are applied
- [ ] All keyboard interactions documented in AGENTS.md work as described
- [ ] Tests pass in all six headless implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Author Metadata, Key Behaviors, ARIA, Keyboard, Props sections in AGENTS.md
- [x] Add CSS class hook to css-style-sheet-template.css
- [x] Add component to components.tsv and AGENTS/components.md

### Backlog

- [ ] Implement HTML headless component
- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Implement Nunjucks headless macro
- [ ] Add to all `*-examples` subprojects
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Cross-check against css-style-sheet-template.css
