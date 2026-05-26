# ContentsLink -- Implementation Plan

## Goal

Implement the ContentsLink component: one table of contents link.

## HTML Tag and CSS Class

- HTML tag: <a>
- CSS class: .contents-link

## Approach

1. Use semantic <a> element with class="contents-link"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <a> with class="contents-link"
- [ ] `aria-current="true"` when the link corresponds to the currently visible section
- [ ] Keyboard: Tab: Focus the link
- [ ] Keyboard: Enter: Follow the link
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless
- [ ] Tests pass in all implementations
