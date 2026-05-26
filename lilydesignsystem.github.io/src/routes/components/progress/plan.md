# Progress — Implementation Plan

## Goal

Implement the Progress component: a horizontal progress bar showing completion.

## HTML Tag and CSS Class

- HTML tag: <progress>
- CSS class: .progress

## Approach

1. Use semantic <progress> element with class="progress"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <progress> with class="progress"
- [ ] `aria-label={label}` -- provides an accessible name describing what process the progress bar represents
- [ ] The `<progress>` element implicitly has `role="Progress"` with `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` attributes managed by the browser
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
