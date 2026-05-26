# Search Input — Implementation Plan

## Goal

Implement the Search Input component: an input for entering a search query <input type="search">.

## HTML Tag and CSS Class

- HTML tag: <input>
- CSS class: .search-input

## Approach

1. Use semantic <input> element with class="search-input"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <input> with class="search-input"
- [ ] `aria-label={label}` -- provides the accessible name for the search field since no visible label element is associated
- [ ] Keyboard: Escape: clears the search field (browser-native behavior for search inputs)
- [ ] Keyboard: Enter: submits the containing form (standard input behavior)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
