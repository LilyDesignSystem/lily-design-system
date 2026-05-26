# Reset Input — Implementation Plan

## Goal

Implement the Reset Input component: a button input that resets a form to default values <input type="reset">.

## HTML Tag and CSS Class

- HTML tag: <input>
- CSS class: .reset-input

## Approach

1. Use semantic <input> element with class="reset-input"
2. Implement keyboard navigation
3. Add vanilla JavaScript for interactive behavior
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <input> with class="reset-input"
- [ ] Keyboard: Enter: activates the reset button
- [ ] Keyboard: Space: activates the reset button
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
