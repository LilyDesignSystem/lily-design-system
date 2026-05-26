# Tree Link — Implementation Plan

## Goal

Implement the Tree Link component: one tree link in the trail.

## HTML Tag and CSS Class

- HTML tag: <a>
- CSS class: .tree-link

## Dependencies

- Requires parent: tree-list-item

## Approach

1. Use semantic <a> element with class="tree-link"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <a> with class="tree-link"
- [ ] `aria-label` -- optional override for descriptive screen reader text, set from the `label` prop
- [ ] Keyboard: Tab: Focus the link
- [ ] Keyboard: Enter: Activate the link (browser default)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
