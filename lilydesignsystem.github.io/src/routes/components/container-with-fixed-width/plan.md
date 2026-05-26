# ContainerWithFixedWidth — Implementation Plan

## Goal

Implement the ContainerWithFixedWidth component: a centered content wrapper with a fixed max-width breakpoint.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .container-with-fixed-width

## Approach

1. Use semantic <div> element with class="container-with-fixed-width"
2. Add ARIA attributes for accessibility
3. Implement keyboard interaction (where applicable)
4. Add vanilla JavaScript for interactive behavior (where applicable)
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React headless (React 19 + TypeScript)
8. Implement in Vue headless (Vue 3 + TypeScript)
9. Implement in Nunjucks headless (macro)
10. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="container-with-fixed-width"
- [ ] Required ARIA attributes are set
- [ ] All user-facing strings come through props or params (i18n-ready)
- [ ] Headless: zero CSS classes beyond the base class plus consumer extras
- [ ] WCAG 2.2 AAA compliant
- [ ] Tests pass in all implementations
