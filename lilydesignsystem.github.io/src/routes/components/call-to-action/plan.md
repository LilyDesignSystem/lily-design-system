# Call To Action — Implementation Plan

## Goal

Implement the Call To Action component: a prominent prompt encouraging user action.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .call-to-action

## Approach

1. Use semantic <div> element with class="call-to-action"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="call-to-action"
- [ ] Optional `aria-label` -- provides screen reader text when visible text alone is insufficient
- [ ] Keyboard: Tab: Focus the element
- [ ] Keyboard: Enter: Activate the link or button
- [ ] Keyboard: Space: Activate the button (button mode only; links do not respond to Space)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
