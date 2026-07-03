# Date Time Now Input — Specification

Single source of truth for spec-driven development of the Date Time Now Input component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Date Time Now Input component: an input for entering a date and time and "now" button <input type="date"><input type="time"><button type="button">.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .date-time-now-input

## Approach

1. Use semantic <div> wrapper with class="date-time-now-input"
2. Add <input type="date"> and <input type="time"> with ARIA attributes
3. Add <button type="button"> that sets both inputs to current date and time
4. Implement keyboard navigation
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="date-time-now-input"
- [ ] Contains <input type="date"> with `aria-label`
- [ ] Contains <input type="time"> with `aria-label`
- [ ] Contains <button type="button"> with `aria-label`
- [ ] "Now" button sets date and time to current local values
- [ ] Keyboard: Tab moves focus between date input, time input, and button
- [ ] Keyboard: Enter/Space on button sets current date and time
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .date-time-now-input to css-style-sheet-template.css
- [x] Implement HTML headless component (date-time-now-input.html)
- [x] Implement Svelte headless component (DateTimeNowInput.svelte)
- [x] Implement React headless component (DateTimeNowInput.tsx)
- [x] Implement Vue headless component (DateTimeNowInput.vue)

### Backlog

- [ ] Implement HTML headless test (date-time-now-input.test.js)
- [ ] Implement Svelte headless test (DateTimeNowInput.test.ts)
- [ ] Implement React headless test (DateTimeNowInput.test.tsx)
- [ ] Implement Vue headless test (DateTimeNowInput.test.ts)
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Cross-check against css-style-sheet-template.css
