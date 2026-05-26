# Diff -- Implementation Plan

## Goal

Implement the Diff component: a side-by-side comparison of two items.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .diff

## Approach

1. Use <div> element with class="diff" and role="group"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="diff"
- [ ] `role="group"` with `aria-label` identifies the comparison region
- [ ] Keyboard: Tab: Focus moves between interactive elements
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless
- [ ] Tests pass in all implementations
