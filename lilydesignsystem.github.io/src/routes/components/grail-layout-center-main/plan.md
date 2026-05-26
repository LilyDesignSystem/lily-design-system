# Grail Layout Center Main — Implementation Plan

## Goal

Implement the Grail Layout Center Main component: grail layout center main content with <main> tag.

## HTML Tag and CSS Class

- HTML tag: <main>
- CSS class: .grail-layout-center-main

## Dependencies

- Requires parent: grail-layout

## Approach

1. Use semantic <main> element with class="grail-layout-center-main"
2. Implement in HTML headless (plain HTML + vanilla JS)
3. Implement in Svelte headless (Svelte 5 + runes)
4. Implement in React, Vue, Blazor headless
5. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <main> with class="grail-layout-center-main"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
