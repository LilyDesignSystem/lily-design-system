# Icon — Implementation Plan

## Goal

Implement the Icon component: a container for displaying an icon.

## HTML Tag and CSS Class

- HTML tag: <span>
- CSS class: .icon

## Approach

1. Use semantic <span> element with class="icon"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <span> with class="icon"
- [ ] `role="img"` -- applied to meaningful icons so assistive technology treats the span as an image
- [ ] `aria-label="..."` -- provides the accessible name for meaningful icons
- [ ] `aria-hidden="true"` -- applied when `decorative` is true, hiding the icon from the accessibility tree
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
