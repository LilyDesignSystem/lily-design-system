# Header — Implementation Plan

## Goal

Implement the Header component: a page or section header area.

## HTML Tag and CSS Class

- HTML tag: <header>
- CSS class: .header

## Approach

1. Use semantic <header> element with class="header"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <header> with class="header"
- [ ] `aria-label={label}` -- optionally provides an accessible name for the header landmark, useful when multiple headers exist on a page to help screen reader users distinguish between them
- [ ] The `<header>` element implicitly has `role="banner"` when it is a direct child of `<body>`, providing a page-level landmark
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
