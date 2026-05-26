# Statistic — Specification

Single source of truth for spec-driven development of the Statistic component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Statistic component: a numeric value display with title, prefix, and suffix.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .statistic

## Approach

1. Use semantic <div> container with role="group" and class="statistic"
2. Render the title in <div class="statistic-title">
3. Render the value in <div class="statistic-value">
4. Render optional prefix in <span class="statistic-prefix">
5. Render optional suffix in <span class="statistic-suffix">
6. Compute aria-label as the label prop when provided, else "{title}: {value}"
7. Implement in HTML headless (plain HTML)
8. Implement in Svelte headless (Svelte 5 + runes)
9. Implement in React headless (React 19 + TypeScript)
10. Implement in Vue headless (Vue 3 + TypeScript)
11. Implement in Nunjucks headless (macro)
12. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div class="statistic" role="group">
- [ ] Title and value render in their dedicated child elements
- [ ] aria-label defaults correctly and respects override
- [ ] Prefix/suffix only render when provided
- [ ] All user-facing strings come through props or params (i18n-ready)
- [ ] Headless: zero CSS classes beyond the base classes plus consumer extras
- [ ] WCAG 2.2 AAA compliant
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
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
- [ ] Add CSS class .statistic to css-style-sheet-template.css
- [ ] Add comprehensive accessibility tests
- [ ] Add integration tests with parent/child components
