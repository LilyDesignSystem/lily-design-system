# Tour List — Implementation Plan

## Goal

Implement the Tour List component: an ordered list of tour guide steps.

## HTML Tag and CSS Class

- HTML tag: <ol>
- CSS class: .tour-list

## Dependencies

- Requires parent: tour
- Requires children: tour-list-item

## Approach

1. Use semantic <ol> element with class="tour-list"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <ol> with class="tour-list"
- [ ] `role="dialog"` -- identifies the tour overlay as a dialog window
- [ ] `aria-modal="true"` -- indicates the dialog is modal and content behind it is inert
- [ ] `aria-label={label}` -- provides an accessible name describing the tour
- [ ] Keyboard: Escape: Closes the tour by setting `active` to false
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
