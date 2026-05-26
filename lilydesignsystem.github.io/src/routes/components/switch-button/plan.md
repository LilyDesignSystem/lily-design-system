# Switch Button — Implementation Plan

## Goal

Implement the Switch Button component: a toggle switch for turning a setting on or off.

## HTML Tag and CSS Class

- HTML tag: <button>
- CSS class: .switch-button

## Approach

1. Use semantic <button> element with class="switch-button"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <button> with class="switch-button"
- [ ] `role="switch"` -- identifies the element as a two-state toggle switch
- [ ] `aria-checked={checked}` -- communicates whether the switch is currently on (`true`) or off (`false`)
- [ ] `aria-label={label}` -- provides the accessible name for the switch control
- [ ] Keyboard: Space: toggles the switch between on and off states (custom handler with `preventDefault`)
- [ ] Keyboard: Enter: activates the button (native button behavior)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
