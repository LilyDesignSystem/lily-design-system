# Meter — Implementation Plan

## Goal

Implement the Meter component: a gauge displaying a scalar value within a known range.

## HTML Tag and CSS Class

- HTML tag: <meter>
- CSS class: .meter

## Approach

1. Use semantic <meter> element with class="meter"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <meter> with class="meter"
- [ ] `aria-label={label}` -- provides an accessible name describing what the meter measures
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
