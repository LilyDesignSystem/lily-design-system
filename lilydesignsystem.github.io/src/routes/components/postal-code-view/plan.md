# Postal Code View — Implementation Plan

## Goal

Implement the Postal Code View component: a read-only display of a postal or ZIP code.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .postal-code-view

## Companion Component

- postal-code-input (Input/View or Input/Link pair)

## Approach

1. Use semantic <div> element with class="postal-code-view"
2. Implement in HTML headless (plain HTML + vanilla JS)
3. Implement in Svelte headless (Svelte 5 + runes)
4. Implement in React, Vue, Blazor headless
5. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="postal-code-view"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
