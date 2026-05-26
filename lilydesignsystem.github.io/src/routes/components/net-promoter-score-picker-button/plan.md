# Net Promoter Score Picker Button — Implementation Plan

## Goal

Implement the Net Promoter Score Picker Button component: a picker button for selecting a 0-10 Net Promoter Score.

## HTML Tag and CSS Class

- HTML tag: <button>
- CSS class: .net-promoter-score-picker-button

## Dependencies

- Requires parent: net-promoter-score-picker

## Approach

1. Use semantic <button> element with class="net-promoter-score-picker-button"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <button> with class="net-promoter-score-picker-button"
- [ ] `aria-pressed` -- indicates whether this button is the currently selected score (`true` when selected, `false` otherwise)
- [ ] `aria-label` -- provides the accessible name for the button (e.g., "8")
- [ ] Keyboard: Tab: Focus the button
- [ ] Keyboard: Enter / Space: Activate the button to select this score
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
