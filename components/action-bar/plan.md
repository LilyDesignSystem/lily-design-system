# ActionBar — Implementation Plan

## Goal

Implement the ActionBar component: a contextual action bar that appears when items are selected, showing the selection count and bulk action buttons.

## HTML Tag and CSS Class

- HTML tag: <div> with role="toolbar"
- CSS class: .action-bar

## Approach

1. Use a <div> with role="toolbar" and class="action-bar"
2. Render the selectedCountLabel (consumer-formatted) inside a count span
3. Render children (action-bar-button components) as bulk actions
4. Render a clear-selection button only when clearSelectionLabel and onClearSelection are both provided
5. Expose selectedCount via data-selected-count for CSS and tests
6. Implement in HTML headless (plain HTML + vanilla JS)
7. Implement in Svelte headless (Svelte 5 + runes)
8. Implement in React headless (React 19 + TypeScript)
9. Implement in Vue headless (Vue 3 + TypeScript)
10. Implement in Nunjucks headless (macro)
11. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div role="toolbar"> with class="action-bar"
- [ ] aria-label equals the label prop
- [ ] data-selected-count equals the selectedCount prop
- [ ] selectedCountLabel text is rendered
- [ ] Clear button renders only when both clearSelectionLabel and onClearSelection are provided
- [ ] onClearSelection fires when the clear button is activated
- [ ] All user-facing strings come through props or params (i18n-ready)
- [ ] Headless: zero CSS classes beyond the base class plus consumer extras
- [ ] WCAG 2.2 AAA compliant
- [ ] Tests pass in all implementations
