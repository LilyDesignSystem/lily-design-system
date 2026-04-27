# InputWithMask — Implementation Plan

## Goal

Implement the InputWithMask component: an input displaying a format mask placeholder for the user to fill in.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .input-with-mask

## Approach

1. Use a wrapping <div> with class="input-with-mask" and data-mask attribute
2. Render the mask string in a decorative <span class="input-with-mask-display" aria-hidden="true">
3. Render <input class="input-with-mask-control" type="text"> with aria-label, value, placeholder, disabled
4. Wire onInput / oninput handler to the input
5. Pass through additional HTML attributes
6. Implement in HTML headless (plain HTML + vanilla JS)
7. Implement in Svelte headless (Svelte 5 + runes)
8. Implement in React headless (React 19 + TypeScript)
9. Implement in Vue headless (Vue 3 + TypeScript)
10. Implement in Nunjucks headless (macro)
11. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="input-with-mask" and data-mask
- [ ] Decorative mask span has aria-hidden="true"
- [ ] Inner <input> has aria-label and class="input-with-mask-control"
- [ ] All user-facing strings come through props or params (i18n-ready)
- [ ] Headless: zero CSS classes beyond the base class plus consumer extras
- [ ] WCAG 2.2 AAA compliant
- [ ] Tests pass in all implementations
