# FloatButton — Implementation Plan

## Goal

Implement the FloatButton component: a floating action button anchored to a viewport corner.

## HTML Tag and CSS Class

- HTML tag: <button>
- CSS class: .float-button

## Approach

1. Use semantic <button> element with class="float-button"
2. Apply inline style position: fixed plus corner offsets per position prop
3. Emit data-position with the chosen corner
4. Require the label prop and apply it as aria-label
5. Default type to "button"; respect type and disabled props
6. Implement in HTML headless (plain HTML)
7. Implement in Svelte headless (Svelte 5 + runes)
8. Implement in React headless (React 19 + TypeScript)
9. Implement in Vue headless (Vue 3 + TypeScript)
10. Implement in Nunjucks headless (macro)
11. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <button> with class="float-button"
- [ ] Required ARIA attributes are set (aria-label)
- [ ] Inline style includes position: fixed and the right corner offsets
- [ ] All user-facing strings come through props or params (i18n-ready)
- [ ] Headless: zero CSS classes beyond the base class plus consumer extras
- [ ] WCAG 2.2 AAA compliant
- [ ] Tests pass in all implementations
