# Image Input — Implementation Plan

## Goal

Implement the Image Input component: a graphical submit button that displays an image <input type="image">.

## HTML Tag and CSS Class

- HTML tag: <input>
- CSS class: .image-input

## Approach

1. Use semantic <input> element with class="image-input"
2. Implement keyboard navigation
3. Add vanilla JavaScript for interactive behavior
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <input> with class="image-input"
- [ ] Keyboard: Enter: activates the image button and submits the form
- [ ] Keyboard: Space: activates the image button and submits the form
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
