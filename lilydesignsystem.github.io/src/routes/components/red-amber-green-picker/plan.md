# Red Amber Green Picker — Implementation Plan

## Goal

Implement the Red Amber Green Picker component: a picker for selecting a red/amber/green status.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .red-amber-green-picker

## Dependencies

- Requires children: red-amber-green-picker-button

## Companion Component

- red-amber-green-view (Input/View or Input/Link pair)

## Approach

1. Use semantic <div> element with class="red-amber-green-picker"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="red-amber-green-picker"
- [ ] `aria-label` on the select from the label prop
- [ ] Keyboard: Arrow keys navigate options (native select behavior)
- [ ] Keyboard: Enter/Space opens the dropdown
- [ ] Keyboard: Escape closes the dropdown
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
