# Net Promoter Score View — Implementation Plan

## Goal

Implement the Net Promoter Score View component: a read-only display of a Net Promoter Score.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .net-promoter-score-view

## Companion Component

- net-promoter-score-picker (Input/View or Input/Link pair)

## Approach

1. Use semantic <div> element with class="net-promoter-score-view"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="net-promoter-score-view"
- [ ] `aria-label` -- provides the accessible name from the `label` prop so screen readers can announce the context of the displayed score
- [ ] Keyboard: None -- this is a passive informational display, not interactive
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
