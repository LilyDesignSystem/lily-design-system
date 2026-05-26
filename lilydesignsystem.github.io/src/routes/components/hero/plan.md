# Hero -- Implementation Plan

## Goal

Implement the Hero component: a large box or image with a title and description.

## HTML Tag and CSS Class

- HTML tag: <section>
- CSS class: .hero

## Approach

1. Use semantic <section> element with class="hero"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <section> with class="hero"
- [ ] `aria-label` -- describes the hero section for screen readers
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless
- [ ] Tests pass in all implementations
