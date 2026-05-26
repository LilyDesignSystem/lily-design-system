# Grail Layout Bottom Footer — Implementation Plan

## Goal

Implement the Grail Layout Bottom Footer component: grail layout bottom footer full width with <footer> tag.

## HTML Tag and CSS Class

- HTML tag: <footer>
- CSS class: .grail-layout-bottom-footer

## Dependencies

- Requires parent: grail-layout

## Approach

1. Use semantic <footer> element with class="grail-layout-bottom-footer"
2. Implement in HTML headless (plain HTML + vanilla JS)
3. Implement in Svelte headless (Svelte 5 + runes)
4. Implement in React, Vue, Blazor headless
5. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <footer> with class="grail-layout-bottom-footer"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
