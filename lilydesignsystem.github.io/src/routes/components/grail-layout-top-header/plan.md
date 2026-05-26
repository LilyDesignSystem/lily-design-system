# Grail Layout Top Header — Implementation Plan

## Goal

Implement the Grail Layout Top Header component: grail layout top header full width with <header> tag.

## HTML Tag and CSS Class

- HTML tag: <header>
- CSS class: .grail-layout-top-header

## Dependencies

- Requires parent: grail-layout

## Approach

1. Use semantic <header> element with class="grail-layout-top-header"
2. Implement in HTML headless (plain HTML + vanilla JS)
3. Implement in Svelte headless (Svelte 5 + runes)
4. Implement in React, Vue, Blazor headless
5. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <header> with class="grail-layout-top-header"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
