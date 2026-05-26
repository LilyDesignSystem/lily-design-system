# Warning Callout — Implementation Plan

## Goal

Implement the Warning Callout component: a callout box highlighting a warning message.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .warning-callout

## Approach

1. Use semantic <div> element with class="warning-callout"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="warning-callout"
- [ ] `role="alert"` -- identifies the content as an alert; screen readers announce it immediately when it appears or changes
- [ ] `aria-label={label}` -- optional accessible name to distinguish this alert from others on the page
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
