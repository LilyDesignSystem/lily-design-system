# Tour List Item — Implementation Plan

## Goal

Implement the Tour List Item component: one step in a tour guide list.

## HTML Tag and CSS Class

- HTML tag: <li>
- CSS class: .tour-list-item

## Dependencies

- Requires parent: tour-list

## Approach

1. Use semantic <li> element with class="tour-list-item"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <li> with class="tour-list-item"
- [ ] `role="group"` -- groups the step content semantically
- [ ] `aria-roledescription="step"` -- identifies the element as a tour step
- [ ] `aria-label` -- provides an accessible name, optionally including "Step N of M"
- [ ] `aria-current="step"` -- indicates the currently active step
- [ ] `aria-hidden="true"` -- hides inactive steps from assistive technology
- [ ] Keyboard: None directly -- keyboard interactions are managed by the parent TourGuideList and by interactive elements within step content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
