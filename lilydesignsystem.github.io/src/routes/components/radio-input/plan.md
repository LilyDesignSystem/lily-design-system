# Radio Input — Implementation Plan

## Goal

Implement the Radio Input component: a single radio button input <input type="radio">.

## HTML Tag and CSS Class

- HTML tag: <input>
- CSS class: .radio-input

## Approach

1. Use semantic <input> element with class="radio-input"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <input> with class="radio-input"
- [ ] `aria-label={label}` -- provides an accessible name for the radio button since no visible `<label>` element is included
- [ ] Keyboard: **Tab**: Moves focus to the selected radio in the group (or the first if none selected)
- [ ] Keyboard: **Arrow Up / Arrow Left**: Moves selection to the previous radio in the group
- [ ] Keyboard: **Arrow Down / Arrow Right**: Moves selection to the next radio in the group
- [ ] Keyboard: **Space**: Selects the focused radio button (if not already selected)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
