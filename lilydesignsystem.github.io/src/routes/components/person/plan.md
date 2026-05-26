# Person -- Implementation Plan

## Goal

Implement the Person component: a person component that contains other person-related information.

## HTML Tag and CSS Class

- HTML tag: <article>
- CSS class: .person

## Approach

1. Use semantic <article> element with class="person"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <article> with class="person"
- [ ] `aria-label` -- describes the person for screen readers
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless
- [ ] Tests pass in all implementations
