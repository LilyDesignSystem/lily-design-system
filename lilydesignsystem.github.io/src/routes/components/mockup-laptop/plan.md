# MockupLaptop -- Implementation Plan

## Goal

Implement the MockupLaptop component: a box area that looks like a laptop computer.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .mockup-laptop

## Approach

1. Use semantic <div> element with class="mockup-laptop"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="mockup-laptop"
- [ ] `role="img"` -- presents the mockup as a decorative image
- [ ] `aria-label` -- describes the mockup content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless
- [ ] Tests pass in all implementations
