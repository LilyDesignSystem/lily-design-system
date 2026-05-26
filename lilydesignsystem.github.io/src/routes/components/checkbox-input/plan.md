# Checkbox Input — Implementation Plan

## Goal

Implement the Checkbox Input component: a checkbox input for toggling a boolean value <input type="checkbox">.

## HTML Tag and CSS Class

- HTML tag: <input>
- CSS class: .checkbox-input

## Approach

1. Use semantic <input> element with class="checkbox-input"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <input> with class="checkbox-input"
- [ ] `aria-label={label}` -- provides an accessible name for the checkbox since there is no visible `<label>` element
- [ ] Keyboard: Space: Toggles the checkbox checked state (native browser behavior)
- [ ] Keyboard: Tab: Moves focus to and from the checkbox (native browser behavior)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
