# Date Time Now Input -- Implementation Plan

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
