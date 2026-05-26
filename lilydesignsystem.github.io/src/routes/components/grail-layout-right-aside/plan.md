# Grail Layout Right Aside — Implementation Plan

## Goal

Implement the Grail Layout Right Aside component: grail layout right aside sidebar with <aside> tag.

## HTML Tag and CSS Class

- HTML tag: <aside>
- CSS class: .grail-layout-right-aside

## Dependencies

- Requires parent: grail-layout

## Approach

1. Use semantic <aside> element with class="grail-layout-right-aside"
2. Implement in HTML headless (plain HTML + vanilla JS)
3. Implement in Svelte headless (Svelte 5 + runes)
4. Implement in React, Vue, Blazor headless
5. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <aside> with class="grail-layout-right-aside"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
