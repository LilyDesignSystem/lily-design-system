# Affix — Implementation Plan

## Goal

Implement the Affix component: a wrapper that pins its content to a viewport position while the page scrolls.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .affix

## Approach

1. Use semantic <div> element with class="affix"
2. Apply inline `position: sticky` style as documented headless behavior
3. Apply `top: {offsetTop}px` or `bottom: {offsetBottom}px` from props
4. Default to `top: 0` when neither offset is provided
5. Emit data-offset-top and data-offset-bottom data attributes
6. Implement in HTML headless (plain HTML)
7. Implement in Svelte headless (Svelte 5 + runes)
8. Implement in React headless (React 19 + TypeScript)
9. Implement in Vue headless (Vue 3 + TypeScript)
10. Implement in Nunjucks headless (macro)
11. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="affix"
- [ ] Inline style includes position: sticky and the correct top/bottom offset
- [ ] Children render inside the affix container
- [ ] Pass-through attributes are forwarded to the root element
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS classes beyond the base class plus consumer extras
- [ ] Tests pass in all implementations
