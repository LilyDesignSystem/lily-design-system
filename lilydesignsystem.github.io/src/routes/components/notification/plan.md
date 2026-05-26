# Notification — Implementation Plan

## Goal

Implement the Notification component: a brief message about an event or update.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .notification

## Approach

1. Use semantic <div> element with class="notification"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="notification"
- [ ] `role="status"` -- applied by default for non-urgent notifications; politely announces content changes
- [ ] `role="alert"` -- applied when `urgent` is true; assertively interrupts the user
- [ ] `aria-label="..."` -- provides an accessible name for the notification region
- [ ] `aria-live="polite"` -- default live region politeness; waits for user idle before announcing
- [ ] `aria-live="assertive"` -- applied when `urgent` is true; announces immediately
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
