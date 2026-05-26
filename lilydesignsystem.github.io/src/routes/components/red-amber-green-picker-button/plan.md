# Red Amber Green Picker Button — Implementation Plan

## Goal

Implement the Red Amber Green Picker Button component: a picker button for selecting a red/amber/green status.

## HTML Tag and CSS Class

- HTML tag: <button>
- CSS class: .red-amber-green-picker-button

## Dependencies

- Requires parent: red-amber-green-picker

## Approach

1. Use semantic <button> element with class="red-amber-green-picker-button"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <button> with class="red-amber-green-picker-button"
- [ ] `aria-pressed` -- indicates whether this button is the currently selected status (`true` when selected, `false` otherwise)
- [ ] `aria-label` -- provides the accessible name for the button (e.g., "Amber - Caution")
- [ ] Keyboard: Tab: Focus the button
- [ ] Keyboard: Enter / Space: Activate the button to select this status
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
