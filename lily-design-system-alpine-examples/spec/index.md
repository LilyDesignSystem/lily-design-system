# Lily Design System™ — Alpine.js Examples — Specification

Living specification. Project-wide rules: [root spec](../../spec/index.md); the example contract: [spec/examples](../../spec/examples/index.md).

## 1. Scope

### In scope

- A static site of 578 pages: home, the components index, one page per catalog component (581), the helpers index and four helper pages.
- Live demos of every component under real Alpine; the shipped snippet shown unchanged beneath each.
- Demo pages for `alpine-data-grid`, `alpine-kanban-board`, `alpine-calendar` and `alpine-gantt-chart`.
- A theme selector over the root `themes/` that persists in `localStorage`.

### Out of scope (not built yet)

- Composed-page demos (dashboard, contact form, search and filter …).
- An Alpine theme-picker, locale-picker, text-size-picker and the other helpers.
- Per-component curated demo data: the demos are filled from the snippets (see the index), so a component whose content is a
  consumer's data shows placeholder text.

## 2. Acceptance criteria

- [x] `/`, `/components`, `/components/{slug}` exist and are generated for all 581 components.
- [x] Every demo mounts under Alpine in jsdom with no error, keeps its base class and has no empty `aria-label`.
- [x] Skip link first, header / nav / main / footer landmarks, `lang`, on every page.
- [x] Chromium + axe (WCAG 2.2 AA): all 578 pages clean, except one named reference-theme finding.
- [x] The four helpers' mouse and keyboard flows pass in Chromium.
- [ ] Composed pages; the Alpine pickers.

## 3. Findings the sweep surfaced (fixed in the Alpine catalog)

- A `role="radio"` button without `aria-checked` (six picker buttons): now `aria-checked="false"`.
- The tab panel's sample tablist had unnamed tabs.
- The tour's `<li role="group">` is invalid inside an `<ol>`; steps are plain list items with `aria-roledescription="step"`.
- The hidden file input of `file-upload` was still reachable; it is `aria-hidden` with `tabindex="-1"`.

## Related topics

[Alpine headless](../../lily-design-system-alpine-headless/spec/index.md), [examples](../../spec/examples/index.md), [testing](../../spec/testing/index.md).

Lily™ and Lily Design System™ are trademarks.
