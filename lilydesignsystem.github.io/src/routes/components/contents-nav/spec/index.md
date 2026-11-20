# Contents Nav — Specification

Single source of truth for spec-driven development of the Contents Nav component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Contents Nav component: a navigation landmark for a list of contents.

## HTML Tag and CSS Class

- HTML tag: <nav>
- CSS class: .contents-nav

## Dependencies

- Requires children: contents-list, contents-list-item

## Approach

1. Use semantic <nav> element with class="contents-nav"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <nav> with class="contents-nav"
- [ ] `aria-label={label}` -- provides an accessible name for the `<nav>` landmark, distinguishing it from other navigation regions on the page
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] With `spy`: exactly one link carries `aria-current` and `data-active`; clicks hold their link until the scroll settles; the URL hash wins on load (see `AGENTS.md`)
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .contents-nav to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (contents-nav.html)
- [ ] Implement HTML headless test (contents-nav.test.js)
- [ ] Implement child component: contents-list
- [ ] Implement child component: contents-list-item

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css

## Scrollspy (added 2026-10-14)

`spy` adds scrollspy to this component rather than a new one (see [spec/components/scrollspy.md](../../../spec/components/scrollspy.md)
for the research and the design choices). Svelte is canonical; the other seven libraries port it.

- Props: `spy`, `offset`, `root`, `current`, `active`, `onActiveChange` (see `AGENTS.md`).
- Algorithm: last section whose top is at or above the line (+1 px); the last section at the bottom of the scroll range;
  the first before any. Computed on scroll and resize (frame-throttled), on `hashchange`, and once on mount.
- Click lock: released by `scrollend`, or after 1 s where that does not fire.
- Testing: jsdom has no layout, so unit tests mock `getBoundingClientRect` and `scrollHeight`; a real-browser run on a long
  page is still owed (bottom of page, click lock, fixed header).
