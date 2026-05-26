# Toast — Implementation Plan

## Goal

Implement the Toast component: a brief auto-dismissing notification message.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .toast

## Approach

1. Use semantic <div> element with class="toast"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="toast"
- [ ] `role="status"` -- (default) identifies a live region with advisory information, announced at the next graceful opportunity
- [ ] `role="alert"` -- (when `urgent` is true) identifies a live region with important, time-sensitive information, announced immediately
- [ ] `aria-live="polite"` -- (default) screen reader waits for a pause before announcing the content
- [ ] `aria-live="assertive"` -- (when `urgent` is true) screen reader interrupts current speech to announce the content
- [ ] `aria-label={label}` -- optional descriptive label for the toast region
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
