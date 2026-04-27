# CollectionListItem — Implementation Plan

## Goal

Implement the CollectionListItem component: one item in a collection list with optional image, heading, meta, and description.

## HTML Tag and CSS Class

- HTML tag: <li>
- CSS class: .collection-list-item

## Approach

1. Use semantic <li> element with class="collection-list-item"
2. Render the required `heading` inside an `<h3>` element
3. Wrap heading text in `<a>` when `href` is provided
4. Render optional `<img>` thumbnail when `imageUrl` is provided
5. Render optional `<p class="collection-list-item-meta">` when `meta` is provided
6. Render optional `<p class="collection-list-item-description">` when `description` is provided
7. Render optional children after the description
8. Implement in HTML headless (plain HTML + vanilla JS)
9. Implement in Svelte headless (Svelte 5 + runes)
10. Implement in React headless (React 19 + TypeScript)
11. Implement in Vue headless (Vue 3 + TypeScript)
12. Implement in Nunjucks headless (macro)
13. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <li> with class="collection-list-item"
- [ ] heading is rendered as an <h3>
- [ ] href correctly wraps the heading in <a>
- [ ] All user-facing strings come through props or params (i18n-ready)
- [ ] Headless: zero CSS classes beyond the base class plus consumer extras
- [ ] WCAG 2.2 AAA compliant
- [ ] Tests pass in all implementations
