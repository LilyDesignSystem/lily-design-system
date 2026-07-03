# ActionGroup — Specification

Single source of truth for spec-driven development of the ActionGroup component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the ActionGroup component: a group of action buttons that can collapse to an overflow menu when space is constrained.

## HTML Tag and CSS Class

- HTML tag: <div> with role="group"
- CSS class: .action-group

## Approach

1. Use a <div> with role="group" and class="action-group"
2. Render the visible children action buttons inside the group
3. Render an overflow trigger button only when the `overflow` slot/prop is provided
4. Wire `aria-haspopup="menu"`, `aria-expanded={overflowOpen}`, and the optional `overflowLabel` on the overflow trigger
5. Render the overflow content in a panel that uses the `hidden` attribute when closed
6. Forward `onOverflowToggle` from the overflow trigger click
7. Implement in HTML headless (plain HTML + vanilla JS)
8. Implement in Svelte headless (Svelte 5 + runes)
9. Implement in React headless (React 19 + TypeScript)
10. Implement in Vue headless (Vue 3 + TypeScript)
11. Implement in Nunjucks headless (macro)
12. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div role="group"> with class="action-group"
- [ ] aria-label equals the label prop
- [ ] Visible children render inside the group
- [ ] Overflow trigger renders only when `overflow` is provided
- [ ] aria-expanded on the overflow trigger reflects `overflowOpen`
- [ ] Overflow panel uses the hidden attribute when closed
- [ ] onOverflowToggle fires when the overflow trigger is activated
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
- [ ] Add CSS class .action-group to css-style-sheet-template.css
- [ ] Add overflow-menu integration tests
- [ ] Add comprehensive accessibility tests
