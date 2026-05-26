# Fieldset — Implementation Plan

## Goal

Implement the Fieldset component: a group of related form fields with a legend.

## HTML Tag and CSS Class

- HTML tag: <fieldset>
- CSS class: .fieldset

## Approach

1. Use semantic <fieldset> element with class="fieldset"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <fieldset> with class="fieldset"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
