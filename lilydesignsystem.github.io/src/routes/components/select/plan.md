# Select — Implementation Plan

## Goal

Implement the Select component: a dropdown select element for choosing one option.

## HTML Tag and CSS Class

- HTML tag: <select>
- CSS class: .select

## Approach

1. Use semantic <select> element with class="select"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <select> with class="select"
- [ ] `aria-label={label}` -- provides an accessible name for the select element since there is no visible `<label>` element
- [ ] The `<select>` element implicitly has `role="combobox"` or `role="listbox"` depending on the browser, with built-in accessible semantics
- [ ] Keyboard: Tab: Moves focus to and from the select element (native browser behavior)
- [ ] Keyboard: Space/Enter: Opens the dropdown list when focused (native browser behavior)
- [ ] Keyboard: Arrow Up/Down: Navigates through options (native browser behavior)
- [ ] Keyboard: Escape: Closes the dropdown list (native browser behavior)
- [ ] Keyboard: Home/End: Jumps to first/last option (native browser behavior)
- [ ] Keyboard: Type-ahead: Typing characters jumps to matching options (native browser behavior)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
