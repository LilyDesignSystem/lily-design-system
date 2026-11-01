# ScrollBar

a custom scrollbar element

This is the Angular headless implementation. See `components/scroll-bar/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

```html
<lily-scroll-bar
  label="Page scroll"
  controls="page-content"
  [(value)]="position"
></lily-scroll-bar>
```

## Inputs

- `label` (string) — accessible name, `aria-label`
- `orientation` (`"vertical" | "horizontal"`, default `"vertical"`) — `aria-orientation`
- `value` (number, two-way `model`, default `0`) — the scroll position, `aria-valuenow`
- `min` / `max` (number, default `0` / `100`) — the range
- `step` (number, default `1`) — the arrow-key increment
- `pageStep` (number, default `10`) — the Page Up / Page Down increment
- `controls` (string) — the scrolled element's id, `aria-controls`

The keys move `value`: Arrow Up/Left and Arrow Down/Right by `step`, Page Up/Page Down by `pageStep`, Home/End to the bounds, clamped.

## Files

- `ScrollBar.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `ScrollBar.spec.ts` — vitest + TestBed render test
