# Tool Bar — Implementation Plan

## Goal

Implement the Tool Bar component: a horizontal bar of tool actions.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .tool-bar

## Dependencies

- Requires children: tool-bar-button

## Approach

1. Use semantic <div> element with class="tool-bar"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="tool-bar"
- [ ] `role="toolbar"` -- identifies the container as a toolbar widget
- [ ] `aria-label` -- provides the accessible name for the toolbar
- [ ] Keyboard: ArrowRight: Move focus to next item (wraps to first)
- [ ] Keyboard: ArrowLeft: Move focus to previous item (wraps to last)
- [ ] Keyboard: Home: Move focus to first item
- [ ] Keyboard: End: Move focus to last item
- [ ] Keyboard: Tab: Enter/exit the toolbar
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
