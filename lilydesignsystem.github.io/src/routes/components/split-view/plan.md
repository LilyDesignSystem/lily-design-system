# SplitView — Implementation Plan

## Goal

Implement the SplitView component: a two-panel resizable layout container with a draggable divider between them.

## HTML Tag and CSS Class

- HTML tag: <div> container with two <section> panels and a role="separator" divider
- CSS class: .split-view

## Approach

1. Use a <div class="split-view"> container with aria-label, data-orientation, and data-split-percent
2. Render the primary content inside <section class="split-view-primary">
3. Render the secondary content inside <section class="split-view-secondary">
4. If a custom `divider` slot/prop is provided, render it between the two sections
5. Otherwise render a default <div class="split-view-divider" role="separator"> with aria-orientation, aria-valuenow, aria-valuemin, aria-valuemax, tabindex="0"
6. Keep all drag and keyboard resize logic in the consumer
7. Implement in HTML headless (plain HTML + vanilla JS)
8. Implement in Svelte headless (Svelte 5 + runes)
9. Implement in React headless (React 19 + TypeScript)
10. Implement in Vue headless (Vue 3 + TypeScript)
11. Implement in Nunjucks headless (macro)
12. Create tests for each implementation

## Acceptance Criteria

- [ ] Container <div> has class="split-view"
- [ ] aria-label equals the label prop
- [ ] data-orientation equals the orientation prop
- [ ] data-split-percent equals the splitPercent prop
- [ ] Primary panel renders inside <section class="split-view-primary">
- [ ] Secondary panel renders inside <section class="split-view-secondary">
- [ ] Default divider has role="separator", aria-orientation, aria-valuenow/min/max, tabindex="0"
- [ ] Custom divider slot replaces the default when provided
- [ ] All user-facing strings come through props or params (i18n-ready)
- [ ] Headless: zero CSS classes beyond the base class plus consumer extras
- [ ] WCAG 2.2 AAA compliant
- [ ] Tests pass in all implementations
