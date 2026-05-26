# Measurement Unit View — Implementation Plan

## Goal

Implement the Measurement Unit View component: a read-only display of a measurement unit.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .measurement-unit-view

## Companion Component

- measurement-unit-input (Input/View or Input/Link pair)

## Approach

1. Use semantic <div> element with class="measurement-unit-view"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="measurement-unit-view"
- [ ] `aria-label` -- optionally set from the `label` prop to provide additional context beyond the displayed unit abbreviation
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
