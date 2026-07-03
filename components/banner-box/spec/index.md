# Banner Box — Specification

Single source of truth for spec-driven development of the Banner Box component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Banner Box component: a banner box that is inside a banner component, using flexbox horizontal.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .banner-box

## Approach

1. Use semantic <div> element with class="banner-box"
2. Render children content inside the div
3. Spread restProps onto the div for consumer extensibility
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="banner-box"
- [ ] Renders children content
- [ ] Works inside a Banner component
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .banner-box to css-style-sheet-template.css
- [x] Implement HTML headless component (banner-box.html)
- [x] Implement Svelte headless component (BannerBox.svelte)
- [x] Implement React headless component (BannerBox.tsx)
- [x] Implement Vue headless component (BannerBox.vue)
- [x] Add to Svelte SvelteKit examples
- [x] Add to React Next.js examples
- [x] Add to Vue Nuxt.js examples

### Backlog

- [ ] Implement HTML headless test (banner-box.test.js)
- [ ] Implement Svelte headless test (BannerBox.test.ts)
- [ ] Implement React headless test (BannerBox.test.tsx)
- [ ] Implement Vue headless test (BannerBox.test.ts)
- [ ] Implement Blazor headless component
- [ ] Cross-check against css-style-sheet-template.css
