# Submit Input — Implementation Plan

## Goal

Implement the Submit Input component: a button input that submits a form <input type="submit">.

## HTML Tag and CSS Class

- HTML tag: <input>
- CSS class: .submit-input

## Approach

1. Use semantic <input> element with class="submit-input"
2. Implement keyboard navigation
3. Add vanilla JavaScript for interactive behavior
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <input> with class="submit-input"
- [ ] Keyboard: Enter: activates the submit button
- [ ] Keyboard: Space: activates the submit button
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
