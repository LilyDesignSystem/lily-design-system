# Text Input With Search -- Implementation Plan

## Goal

Implement the Text Input With Search component: a single-line text input field <input type="text"> with search capability.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .text-input-with-search

## Approach

1. Use semantic <div> wrapper with role="search" and class="text-input-with-search"
2. Add <input type="text"> with aria-label
3. Add <button type="button"> that triggers search callback
4. Add Enter key handler on input to trigger search
5. Implement in all headless and example subprojects

## Acceptance Criteria

- [ ] Renders <div> with class="text-input-with-search" and role="search"
- [ ] Contains <input type="text"> with aria-label
- [ ] Contains <button type="button"> with aria-label
- [ ] Enter in input triggers search
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless
