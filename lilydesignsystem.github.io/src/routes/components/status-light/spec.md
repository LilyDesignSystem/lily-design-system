# StatusLight — Specification

Single source of truth for spec-driven development of the StatusLight component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the StatusLight component: a small colored dot status indicator paired with a status label.

## HTML Tag and CSS Class

- HTML tag: <span> with role="status"
- CSS class: .status-light

## Approach

1. Use a <span class="status-light" role="status"> container
2. Apply data-variant={variant} on the container, defaulting to "neutral"
3. Render <span class="status-light-dot" aria-hidden="true"></span>
4. Render <span class="status-light-label">{label}</span>
5. Validate variant against the allowed set: neutral, informative, positive, notice, negative, active, inactive
6. Implement in HTML headless (plain HTML + vanilla JS)
7. Implement in Svelte headless (Svelte 5 + runes)
8. Implement in React headless (React 19 + TypeScript)
9. Implement in Vue headless (Vue 3 + TypeScript)
10. Implement in Nunjucks headless (macro)
11. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <span> with class="status-light"
- [ ] role="status" is present
- [ ] data-variant equals the variant prop and defaults to "neutral"
- [ ] Dot renders with class="status-light-dot" and aria-hidden="true"
- [ ] Label renders with class="status-light-label" and text equals the label prop
- [ ] All user-facing strings come through props or params (i18n-ready)
- [ ] Headless: zero CSS classes beyond the base class plus consumer extras
- [ ] WCAG 2.2 AAA compliant (color never the sole indicator)
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, variants, and ARIA in index.md
- [x] Add canonical entry to components.tsv and AGENTS/components.md

### In Progress

- [ ] Cross-check implementations against the canonical spec

### Backlog

- [ ] Implement HTML headless component
- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Nunjucks headless component
- [ ] Implement Blazor headless component
- [ ] Add CSS class .status-light to css-style-sheet-template.css
- [ ] Add tests for default variant ("neutral")
- [ ] Add tests for each variant value
- [ ] Add WCAG 1.4.1 visual-only-color tests
