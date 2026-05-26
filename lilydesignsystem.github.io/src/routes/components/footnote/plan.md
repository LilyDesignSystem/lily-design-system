# Footnote — Implementation Plan

## Goal

Implement the Footnote component: a footnote reference and content element.

## HTML Tag and CSS Class

- HTML tag: <span>
- CSS class: .footnote

## Approach

1. Use semantic <span> element with class="footnote"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <span> with class="footnote"
- [ ] `role="note"` -- indicates supplementary content that is related to the main content
- [ ] `aria-label="{id}"` -- provides an accessible name derived from the footnote identifier
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
