# Listbox — Implementation Plan

## Goal

Implement the Listbox component: a list of selectable options with keyboard navigation.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .listbox

## Approach

1. Use semantic <div> element with class="listbox"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="listbox"
- [ ] `role="listbox"` -- identifies the container as a listbox widget for selecting from a list of options.
- [ ] `aria-label` -- provides an accessible name describing the purpose of the listbox.
- [ ] Child elements should use `role="option"` and optionally `aria-selected` to indicate selection state.
- [ ] Keyboard: ArrowDown: Moves focus to the next option, wrapping to the first option from the last.
- [ ] Keyboard: ArrowUp: Moves focus to the previous option, wrapping to the last option from the first.
- [ ] Keyboard: Home: Moves focus to the first option.
- [ ] Keyboard: End: Moves focus to the last option.
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
