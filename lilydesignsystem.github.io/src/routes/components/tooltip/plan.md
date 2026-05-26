# Tooltip — Implementation Plan

## Goal

Implement the Tooltip component: a small popup showing descriptive text on hover or focus.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .tooltip

## Approach

1. Use semantic <div> element with class="tooltip"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="tooltip"
- [ ] `role="tooltip"` -- identifies the element as a tooltip, a popup that displays a description for an element
- [ ] `id={id}` -- used with `aria-describedby` on the trigger element to create an accessible association between the trigger and the tooltip
- [ ] Keyboard: Escape: The consumer should hide the tooltip when Escape is pressed (not built into the component; must be handled by the consumer)
- [ ] Keyboard: The tooltip itself does not receive focus; it is a supplementary description for another element
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
