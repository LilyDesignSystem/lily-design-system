# MenuGroup — Implementation Plan

## Goal

Implement the MenuGroup component: a labeled section of menu items within a menu.

## HTML Tag and CSS Class

- HTML tag: <div> with role="group"
- CSS class: .menu-group

## Approach

1. Use a <div> with role="group" and class="menu-group"
2. Set aria-label={label} on the container
3. Render a visible heading <div class="menu-group-heading" aria-hidden="true">{label}</div>
4. Render children (menu-item components) after the heading
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React headless (React 19 + TypeScript)
8. Implement in Vue headless (Vue 3 + TypeScript)
9. Implement in Nunjucks headless (macro)
10. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div role="group"> with class="menu-group"
- [ ] aria-label equals the label prop
- [ ] Heading renders with class="menu-group-heading" and aria-hidden="true"
- [ ] Heading text equals the label prop
- [ ] Children render after the heading
- [ ] All user-facing strings come through props or params (i18n-ready)
- [ ] Headless: zero CSS classes beyond the base class plus consumer extras
- [ ] WCAG 2.2 AAA compliant
- [ ] Tests pass in all implementations
