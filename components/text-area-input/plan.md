# TextAreaInput — Implementation Plan

## Goal

Implement the TextAreaInput component: a multi-line text input area.

## HTML Tag and CSS Class

- HTML tag: <textarea>
- CSS class: .text-area-input

## Approach

1. Use semantic <textarea> element with class="text-area-input"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <textarea> with class="text-area-input"
- [ ] `aria-label={label}` -- provides an accessible name for the text-area-input since there is no visible `<label>` element
- [ ] Keyboard: Tab: Moves focus to and from the text-area-input (native browser behavior)
- [ ] Keyboard: All standard text editing keys function normally within the text-area-input (native browser behavior)
- [ ] Keyboard: Enter: Inserts a new line (does not submit forms, unlike single-line inputs)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
