# Code -- Implementation Plan

## Goal

Implement the Code component: an inline code span for displaying short code snippets within surrounding text.

## HTML Tag and CSS Class

- HTML tag: <code>
- CSS class: .code

## Approach

1. Use semantic <code> element with class="code"
2. Implement in HTML headless (plain HTML + vanilla JS)
3. Implement in Svelte headless (Svelte 5 + runes)
4. Implement in React, Vue, Blazor headless
5. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <code> with class="code"
- [ ] Child content is rendered correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless
- [ ] Tests pass in all implementations
