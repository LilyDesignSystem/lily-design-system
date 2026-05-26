# GovernmentBanner — Specification

Single source of truth for spec-driven development of the GovernmentBanner component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the GovernmentBanner component: a banner identifying a website as belonging to a government, with an expandable details panel.

## HTML Tag and CSS Class

- HTML tag: <aside>
- CSS class: .government-banner

## Approach

1. Use semantic <aside> element with class="government-banner" and aria-label
2. Render <header class="government-banner-header"> with headerText and toggle <button>
3. Generate a stable id for the panel (useId / randomUUID)
4. Wire toggle button with aria-expanded and aria-controls
5. Render panel <div class="government-banner-details"> with hidden when collapsed
6. Wire onToggle / ontoggle callback
7. Implement in HTML headless (plain HTML + vanilla JS for toggle)
8. Implement in Svelte headless (Svelte 5 + runes)
9. Implement in React headless (React 19 + TypeScript with useId)
10. Implement in Vue headless (Vue 3 + TypeScript)
11. Implement in Nunjucks headless (macro)
12. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <aside> with class="government-banner" and aria-label
- [ ] Toggle button has aria-expanded and aria-controls
- [ ] Panel id is stable across renders
- [ ] All user-facing strings come through props or params (i18n-ready)
- [ ] Headless: zero CSS classes beyond the base class plus consumer extras
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
- [ ] Add CSS class .government-banner to css-style-sheet-template.css
- [ ] Add comprehensive accessibility tests for the disclosure pattern
- [ ] Add integration tests with parent/child components
