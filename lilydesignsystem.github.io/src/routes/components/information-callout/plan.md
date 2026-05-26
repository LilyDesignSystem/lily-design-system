# Information Callout — Implementation Plan

## Goal

Implement the Information Callout component: a callout box highlighting informational content.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .information-callout

## Approach

1. Use semantic <div> element with class="information-callout"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="information-callout"
- [ ] `role="note"` -- identifies the content as a note or supplementary information
- [ ] `aria-label={label}` -- provides an accessible name describing the type of callout (e.g., "Note", "Warning", "Tip")
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
