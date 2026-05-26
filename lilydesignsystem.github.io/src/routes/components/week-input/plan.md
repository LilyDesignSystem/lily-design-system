# Week Input — Implementation Plan

## Goal

Implement the Week Input component: an input for selecting a week and year <input type="week">.

## HTML Tag and CSS Class

- HTML tag: <input>
- CSS class: .week-input

## Approach

1. Use semantic <input> element with class="week-input"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <input> with class="week-input"
- [ ] `aria-label={label}` -- provides the accessible name for the week input since no visible label element is associated
- [ ] Keyboard: Up Arrow / Down Arrow: adjust the focused segment (year or week number)
- [ ] Keyboard: Left Arrow / Right Arrow: move focus between year and week segments
- [ ] Keyboard: Enter: confirm selection / submit form
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
