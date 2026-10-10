# LinkPicker (Svelte) — spec

**Package:** `@lilydesignsystem/svelte-link-picker` · **Canonical contract:** this file; the other seven catalogs port it.
Topic summary: [spec/link-picker](../../spec/link-picker/index.md).

## 1. Goal

An icon button — a typical **home** icon — that opens a dropdown of **page links the app defines** ("Home", "About Us",
"Contact Us", "Privacy Policy", …). It owns the whole interaction: open/close, focus, keyboard, tooltip. It owns no routes
and no words: every link, and every accessible name, comes from the consumer.

## 2. Non-goals

- No default links, no English text, no routing. A client-side router is supplied through `navigate`.
- Not a site navigation bar and not an ARIA menu: five links behind an icon, in a page header.
- No persistence, no current-page detection (the app marks `current`).

## 3. Architectural decisions

- **A disclosure of real links, not a menu or listbox.** The items are navigation, so they are `<a href>`: `role="menuitem"`
  would strip middle-click, open-in-new-tab and copy-link-address, and the WAI-ARIA APG itself suggests a disclosure when the
  items are links. Same decision as `share-picker`.
- **Only the trigger composes headless** (`IconButton`); the list is self-built for the same reason `share-picker`'s is.
- **The app defines the links** through the required `links` prop. No default, because a default would be a hardcoded string
  and a hardcoded route.
- **`navigate` is optional.** Without it links are ordinary page loads; with it (SvelteKit `goto`) a plain left click is a
  client-side navigation and modified clicks stay native.

## 4. Public API

### 4.1 Props

| Prop | Type | Required | Notes |
| --- | --- | --- | --- |
| `label` | `string` | yes | Accessible name of the button **and** the list; also the tooltip text. |
| `links` | `LinkItem[]` | yes | `{ id?, label, href, current?, newTab? }`. `id` defaults to `href`. |
| `navigate` | `(href: string) => void` | no | Client-side navigation hook. |
| `onNavigate` | `(id: string, href: string) => void` | no | Fires after a link is chosen. |
| `children` | `Snippet<[{ open }]>` | no | Replaces the **icon**, not the links. |
| `class` | `string` | no | Appended to the root class. |
| `...rest` | | | Spread on the root. |

### 4.2 DOM contract

```html
<div class="link-picker {class}">
  <button class="link-picker-button" type="button" aria-label="{label}" aria-expanded="false" aria-controls="{id}-list">
    <svg class="link-picker-icon" aria-hidden="true" viewBox="0 0 16 16" …home…/>
  </button>
  <div class="link-picker-tooltip" role="tooltip" id="{id}-tooltip" hidden>{label}</div>
  <ul class="link-picker-list" id="{id}-list" aria-label="{label}" hidden>
    <li class="link-picker-list-item"><a class="link-picker-link" href="/" data-link-id="/">Home</a></li>
    …
  </ul>
</div>
```

The current page's link carries `aria-current="page"`. `newTab` links carry `target="_blank" rel="noopener noreferrer"`.

### 4.3 Re-exports

`default` / `LinkPicker`, `linkId`, `nextLinkPickerId`, types `Props`, `ChildArgs`, `LinkItem`.

## 5. Behaviour

### 5.1 Activation

Click toggles the list. Opening focuses the first link; the page does not scroll (`preventScroll`). Choosing a link closes the
list and returns focus to the button (when the link did not navigate away).

### 5.2 Keyboard

- Button: `ArrowDown` opens and focuses the first link (or moves into an open list); `ArrowUp` opens and focuses the last;
  `Enter`/`Space` toggle.
- List: `ArrowDown`/`ArrowUp` move (clamped, no wrap), `Home`/`End` jump, `Escape` closes and returns focus to the button,
  `Tab` closes and moves on.
- Clicking outside, or focus leaving the picker, closes the list.

### 5.3 Tooltip

`<div class="link-picker-tooltip" role="tooltip" hidden>` holds the button's `label`. Visible while the pointer is over the
button or the tooltip (hoverable) or while the button has keyboard focus (`:focus-visible`); `Escape` dismisses it wherever
focus is; never shown while the list is open. Not linked with `aria-describedby` (it duplicates the name).

## 6. Accessibility

WCAG 2.2 AAA target. The button has an accessible name and `aria-expanded`/`aria-controls`; the icon is `aria-hidden`; the
list is named; links are real links with `aria-current="page"` where marked; focus stays visible; no motion.

## 7. Testing acceptance criteria

1. Renders `div.link-picker` containing `button.link-picker-button`, a tooltip and a hidden `ul.link-picker-list`.
2. The button's accessible name is `label`; it has `aria-expanded="false"` and `aria-controls` pointing at the list.
3. The default icon is an `aria-hidden` SVG with class `link-picker-icon`; `children` replaces it.
4. One `a.link-picker-link` per link with the given `href` and text, in order.
5. No links are invented: `links=[]` renders an empty list.
6. The list is named with `label`.
7. Click opens: list visible, `aria-expanded="true"`, first link focused.
8. Click again closes.
9. `ArrowDown` on the button opens and focuses the first link; `ArrowUp` focuses the last.
10. Arrows move between links and clamp at both ends; `Home`/`End` jump.
11. `Escape` closes and returns focus to the button.
12. `Tab` closes without teleporting focus.
13. Clicking outside closes.
14. `current: true` sets `aria-current="page"` on that link only.
15. `newTab: true` sets `target="_blank"` and `rel="noopener noreferrer"`.
16. A link with no `id` reports its `href` to `onNavigate`; one with an `id` reports the `id`.
17. With `navigate`, a plain left click calls `navigate(href)` and prevents the default; a Ctrl/Meta-click and a `newTab`
    link do not.
18. Without `navigate`, a click is not prevented.
19. The tooltip exists with `role="tooltip"`, holds `label`, and is hidden at rest.
20. The tooltip shows on hover and on keyboard focus, hides on `Escape`, and never shows while the list is open.
21. The tooltip is not referenced by `aria-describedby`.
22. `class` is appended to the root; rest props are spread on the root.
23. Two instances get distinct ids.
24. The package source contains no stylesheet, no inline `style`, no English default text and no routes.

## 8. Tracking

- Package: `@lilydesignsystem/svelte-link-picker`
- Version: 0.1.0 (new, 2026-10-07)
- Framework: Svelte 5 + TypeScript
- Test runner: vitest + @testing-library/svelte
