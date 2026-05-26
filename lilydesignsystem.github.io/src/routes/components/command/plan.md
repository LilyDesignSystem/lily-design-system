# Command — Implementation Plan

## Goal

Implement the Command component: a command palette for searching and executing actions.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .command

## Approach

1. Use semantic <div> element with class="command"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="command"
- [ ] `role="search"` -- identifies the outer container as a search landmark region
- [ ] `aria-label={label}` -- provides accessible name for the search region and input
- [ ] `role="listbox"` -- identifies the results container as a listbox for selectable options
- [ ] `aria-label={label}` -- provides accessible name for the listbox
- [ ] Keyboard: **Tab**: Moves focus into and out of the search input
- [ ] Keyboard: Additional keyboard navigation (arrow keys within the listbox) should be implemented by the consumer
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
