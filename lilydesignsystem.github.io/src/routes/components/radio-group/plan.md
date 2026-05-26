# Radio Group — Implementation Plan

## Goal

Implement the Radio Group component: a group of radio buttons for selecting one option.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .radio-group

## Dependencies

- Requires children: radio-input

## Approach

1. Use semantic <div> element with class="radio-group"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="radio-group"
- [ ] `role="radiogroup"` -- identifies the fieldset as a group of radio buttons
- [ ] `aria-label={label}` -- provides an accessible name for the group so screen readers announce the purpose
- [ ] Keyboard: Tab: Moves focus into the radio group; within the group, arrow keys move between radio buttons (native browser behavior)
- [ ] Keyboard: Arrow Up / Arrow Down: Moves selection between radio buttons within the group (native radio behavior)
- [ ] Keyboard: Space: Selects the focused radio button (native radio behavior)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
