# Popup — Implementation Plan

## Goal

Implement the Popup component: a temporary overlay that appears above page content.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .popup

## Approach

1. Use semantic <div> element with class="popup"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="popup"
- [ ] `role="dialog"` -- identifies the popup as a dialog overlay for assistive technology
- [ ] `aria-label="..."` -- provides the accessible name for the dialog
- [ ] Keyboard: Escape: Consumer should implement closing the popup by setting `open` to false
- [ ] Keyboard: Tab: Should trap focus within the popup when open (consumer responsibility)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
