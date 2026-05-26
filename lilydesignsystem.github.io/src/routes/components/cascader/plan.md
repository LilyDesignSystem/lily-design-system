# Cascader — Implementation Plan

## Goal

Implement the Cascader component: a multi-level dropdown for selecting a value from a hierarchy.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .cascader

## Approach

1. Use semantic <div> container with role="combobox" and class="cascader"
2. Render a <button class="cascader-trigger" type="button"> for the trigger
3. Render a <div class="cascader-panel"> for the dropdown content
4. Wire aria-haspopup="tree", aria-expanded, aria-label to the container
5. Toggle panel visibility with the hidden attribute based on the expanded prop
6. Implement in HTML headless (plain HTML)
7. Implement in Svelte headless (Svelte 5 + runes)
8. Implement in React headless (React 19 + TypeScript)
9. Implement in Vue headless (Vue 3 + TypeScript)
10. Implement in Nunjucks headless (macro)
11. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div role="combobox"> with class="cascader"
- [ ] Trigger and panel sub-elements have correct classes
- [ ] aria-haspopup, aria-expanded, aria-label, disabled, hidden are applied correctly
- [ ] All user-facing strings come through props or params (i18n-ready)
- [ ] Headless: zero CSS classes beyond the base classes plus consumer extras
- [ ] WCAG 2.2 AAA compliant
- [ ] Tests pass in all implementations
