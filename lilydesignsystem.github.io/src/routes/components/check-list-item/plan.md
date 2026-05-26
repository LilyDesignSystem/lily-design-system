# CheckListItem -- Implementation Plan

## Goal

Implement the CheckListItem component: one check list item component with a checkbox.

## HTML Tag and CSS Class

- HTML tag: <li>
- CSS class: .check-list-item

## Approach

1. Use semantic <li> element with class="check-list-item"
2. Add checkbox input with proper label association
3. Add ARIA attributes for accessibility
4. Implement keyboard navigation
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <li> with class="check-list-item"
- [ ] Contains checkbox input with label association
- [ ] `aria-checked` reflects the current state
- [ ] Keyboard: Tab: Focus the checkbox
- [ ] Keyboard: Space: Toggle the checkbox state
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless
- [ ] Tests pass in all implementations
