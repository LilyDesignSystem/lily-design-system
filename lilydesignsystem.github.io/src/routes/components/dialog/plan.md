# Dialog — Implementation Plan

## Goal

Implement the Dialog component: a modal or non-modal dialog window.

## HTML Tag and CSS Class

- HTML tag: <dialog>
- CSS class: .dialog

## Approach

1. Use semantic <dialog> element with class="dialog"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <dialog> with class="dialog"
- [ ] `role="dialog"` -- provided natively by the `<dialog>` element
- [ ] `aria-label="{label}"` -- provides an accessible name for the dialog
- [ ] `aria-modal="true"` -- present when the `modal` prop is true, indicating the dialog traps focus and blocks background interaction
- [ ] Keyboard: Escape: closes the dialog by setting `open` to false
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
