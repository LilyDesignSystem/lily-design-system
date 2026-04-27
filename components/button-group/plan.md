# ButtonGroup — Implementation Plan

## Goal

Implement the ButtonGroup component: a wrapper that groups related buttons together.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .button-group

## Approach

1. Use semantic <div> element with class="button-group" and role="group"
2. Apply aria-label from the required label prop
3. Render consumer-supplied buttons as children
4. Pass through additional HTML attributes
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React headless (React 19 + TypeScript)
8. Implement in Vue headless (Vue 3 + TypeScript)
9. Implement in Nunjucks headless (macro)
10. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="button-group" and role="group"
- [ ] aria-label equals the label prop
- [ ] All user-facing strings come through props or params (i18n-ready)
- [ ] Headless: zero CSS classes beyond the base class plus consumer extras
- [ ] WCAG 2.2 AAA compliant
- [ ] Tests pass in all implementations
