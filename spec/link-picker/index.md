# Link Picker

Label: a **home** icon — a bundled SVG (`viewBox="0 0 16 16"`, stroke-based), not a Unicode glyph.

A page-header icon button that opens a dropdown of **page links the app defines**: "Home" → `/`, "About Us", "Contact Us",
"Privacy Policy", whatever the app's pages are. Like `share-picker`, its list is a **disclosure of real links**, not an ARIA menu
or listbox: `role="menuitem"` would strip middle-click, open-in-new-tab and copy-link-address from ordinary links.

Button:

```html
<button
  type="button"
  class="link-picker-button"
  aria-label="Pages"
  aria-expanded="false"
  aria-controls="link-picker-list"
>
  <svg class="link-picker-icon" viewBox="0 0 16 16" aria-hidden="true">…home…</svg>
</button>
```

Tooltip (a sibling right after the button, like every picker's):

```html
<div class="link-picker-tooltip" role="tooltip" id="link-picker-tooltip" hidden>Pages</div>
```

List:

```html
<ul class="link-picker-list" id="link-picker-list" aria-label="Pages" hidden>
  <li class="link-picker-list-item"><a class="link-picker-link" href="/" aria-current="page">Home</a></li>
  <li class="link-picker-list-item"><a class="link-picker-link" href="/about/">About Us</a></li>
  <li class="link-picker-list-item"><a class="link-picker-link" href="/contact/">Contact Us</a></li>
  <li class="link-picker-list-item"><a class="link-picker-link" href="/privacy/">Privacy Policy</a></li>
</ul>
```

## Rules

- **The app defines the links.** The package ships no routes, no default list and no English: `label` (the button's and the list's
  accessible name, and the tooltip text) and every link's `label` and `href` come from the consumer. A link is
  `{ id?, label, href, current?, newTab? }`; `current` sets `aria-current="page"`, `newTab` adds `target="_blank"` with
  `rel="noopener noreferrer"`, `id` (default: the `href`) is what the change callback reports.
- **Client-side routing is the app's.** A framework with a router passes a hook (`navigate`, `onNavigate`, an event) — a plain left
  click is then a router navigation; modified clicks (Ctrl/Cmd/Shift/Alt, middle button) and `newTab` links always stay native.
  Blazor needs none (its router intercepts same-origin links); Nunjucks's macro cannot carry a function, so the hooks go to the
  client runtime.
- **Keyboard** follows `share-picker`'s disclosure: `ArrowDown`/`ArrowUp` open and move (clamped, no wrap), `Home`/`End` jump,
  `Escape` closes and returns focus to the button, `Tab` closes with focus on the button first. Opening focuses a link with
  `preventScroll`. A click outside, or focus leaving the picker, closes the list (Blazor: focus only, no document listener).
- **Tooltip** (the picker-wide contract): hoverable, dismissable with Escape, never shown while the list is open, not linked with
  `aria-describedby`.
- **Placement** is the theme's: the 45 `themes/` anchor the popup to the button and flip it at the window edge (see
  [theme](../theme/index.md#picker-popups)).
- **In `picker-bar`** it is the **leftmost** icon, rendered only when the app supplies `links` and `labels.link`
  ([helpers § picker-bar contract](../helpers/index.md)).

## Packages

`@lilydesignsystem/{svelte,react,vue,angular,html,nunjucks,web-components}-link-picker` and `LilyDesignSystem.Blazor.LinkPicker`
(Web Components tag `<lily-link-picker>`, HTML tag `<link-picker>`, Angular selector `lily-link-picker`). The Svelte package's
`spec/index.md` is canonical (24 acceptance clauses); each port has one test per clause. All first-released at 0.1.0 on
2026-10-07.

## Related

[helpers](../helpers/index.md) · [share-picker](../share-picker/index.md) (the other disclosure of links) ·
[theme](../theme/index.md)
