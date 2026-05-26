# Hidden Input — Implementation Plan

## Goal

Implement the Hidden Input component: a hidden input for including data in form submission <input type="hidden">.

## HTML Tag and CSS Class

- HTML tag: <input>
- CSS class: .hidden-input

## Approach

1. Use semantic <input> element with class="hidden-input"
2. Implement in HTML headless (plain HTML + vanilla JS)
3. Implement in Svelte headless (Svelte 5 + runes)
4. Implement in React, Vue, Blazor headless
5. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <input> with class="hidden-input"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
