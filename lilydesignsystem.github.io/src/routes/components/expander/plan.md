# Expander — Implementation Plan

## Goal

Implement the Expander component: a control that expands to reveal more content.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .expander

## Approach

1. Use semantic <div> element with class="expander"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="expander"
- [ ] `aria-expanded={expanded}` -- on the button, indicates whether the controlled content is currently visible
- [ ] `aria-controls={contentId}` -- on the button, references the id of the expandable content region
- [ ] `role="region"` -- on the content container, identifies the expandable area as a landmark region
- [ ] `aria-label={label}` -- on the content region, provides an accessible name for the region
- [ ] Keyboard: Enter: Toggles the expander open/closed when the button has focus (native button behavior)
- [ ] Keyboard: Space: Toggles the expander open/closed when the button has focus (native button behavior)
- [ ] Keyboard: Tab: Moves focus to/from the toggle button
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
