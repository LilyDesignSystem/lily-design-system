# Popover — Implementation Plan

## Goal

Implement the Popover component: a floating content box anchored to a trigger element.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .popover

## Approach

1. Use semantic <div> element with class="popover"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="popover"
- [ ] `role="dialog"` -- identifies the popover as a dialog overlay for assistive technology
- [ ] `aria-label="..."` -- provides the accessible name for the dialog
- [ ] Keyboard: Escape: Consumer should implement closing the popover by setting `open` to false
- [ ] Keyboard: Tab: Should trap focus within the popover when open (consumer responsibility)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
