# ShareButton — Specification

Single source of truth for the `lily-design-system-svelte-share-button`
Svelte helper. This file drives implementation, testing, and documentation:
anything not in this spec is out of scope; anything in this spec must be
exercised by a test.

Sibling files:

- `ShareButton.svelte` — the implementation
- `ShareButton.test.ts` — vitest spec exercising every clause in §7
- `index.ts` — re-export barrel
- `index.md` — user-facing guide

---

## 1. Goal

Give a Svelte 5 application a drop-in, headless share control that:

1. Renders a single-glyph button (↪, U+21AA) matching the other Lily
   helpers.
2. Uses the **native share sheet** where the browser provides one.
3. Otherwise opens a list of consumer-supplied destinations, plus a
   built-in **copy the page URL** action.
4. Ships zero CSS and zero third-party endpoints.

## 2. Non-goals

- **Shipping a built-in set of social networks.** No URL templates for
  X / Facebook / LinkedIn / Reddit ship with this package. Which networks
  exist is an editorial and privacy decision belonging to the consumer,
  the URLs change, and networks die. The consumer supplies `targets`.
- **Bundling brand icons.** `AGENTS/headless.md` forbids bundled icon
  assets; destination labels are text supplied by the consumer.
- **Share counts, analytics, or tracking.** The component reports what
  the user chose via `onShare`; what you do with that is yours.
- **Persistence.** Unlike the `*-select` helpers, this control has no
  state to remember. Nothing is written to `localStorage`.

## 3. Architectural decisions

- **A helper, but not a preference lifecycle.** The other helpers own
  *selection + DOM application + optional persistence*. This one owns an
  *action*: it applies nothing to the document and persists nothing. It
  is a helper because it owns a complete interaction end to end and ships
  the same headless contract. See `AGENTS/helpers.md`.
- **Disclosure + real links, not a menu.** Share destinations are
  navigation, so they render as real `<a>` elements. `role="menuitem"`
  would strip middle-click, open-in-new-tab and copy-link-address — real
  affordances users rely on for exactly this kind of list. The WAI-ARIA
  APG itself suggests a disclosure when the items are links. Copy is a
  genuine action, so it is a `<button>`.
- **`href` is a function, not a template string.** The consumer builds
  the whole URL and owns any encoding, so no endpoint or query-parameter
  convention is baked in.
- **No default copy label.** The copy item renders only when `copyLabel`
  is supplied, because a default would be a hardcoded English string —
  see `AGENTS/internationalization.md`.
- **A dismissed native sheet is not a failure.** `navigator.share()`
  rejects when the user dismisses the sheet. Falling back to the list
  there would resurrect UI the user just dismissed, so a rejection ends
  the interaction.

## 4. Public API

### 4.1 Props

| Prop | Type | Required | Default | Purpose |
| ---- | ---- | -------- | ------- | ------- |
| `label` | `string` | yes | — | Accessible name for the button and the list. |
| `targets` | `ShareTarget[]` | no | `[]` | Destinations to offer. Empty is valid when `copyLabel` is set. |
| `url` | `string` | no | current page URL | URL to share. Resolved lazily, so the default is SSR-safe. |
| `title` | `string` | no | `""` | Passed to `href(...)` and the native sheet. |
| `text` | `string` | no | `""` | Passed to `href(...)` and the native sheet. |
| `copyLabel` | `string` | no | `undefined` | Label for the copy item. Omit it and no copy item renders. |
| `copiedLabel` | `string` | no | `undefined` | Announced in the status region after a successful copy. |
| `copyFailedLabel` | `string` | no | `undefined` | Announced when the clipboard write fails. |
| `strategy` | `"auto" \| "native" \| "list"` | no | `"auto"` | Whether to prefer the native sheet. |
| `children` | `Snippet<[ChildArgs]>` | no | the ↪ glyph | Replaces the button glyph. |
| `onShare` | `(id, url) => void` | no | — | Fires when a destination is chosen. |
| `onCopy` | `(url) => void` | no | — | Fires after a successful copy. |
| `onNativeShare` | `(url) => void` | no | — | Fires when the native sheet was used instead of the list. |
| `class` | `string` | no | `""` | Extra class on the root. |
| `...restProps` | any HTML attributes | no | — | Spread onto the root `<div>`. |

```ts
type ShareTarget = {
  id: string;
  label: string;
  href: (url: string, title: string, text: string) => string;
  newTab?: boolean;   // default true
};

type ChildArgs = { open: boolean; url: string };
```

### 4.2 DOM contract

```html
<div class="share-button {class}">
  <button type="button" class="share-button-trigger"
          aria-label="{label}" aria-expanded aria-controls="{listId}">
    <span class="share-button-icon" aria-hidden="true">↪</span>
  </button>
  <ul class="share-button-list" id="{listId}" hidden>
    <li class="share-button-list-item">
      <a class="share-button-target" data-target-id="{id}" href="{href(...)}"
         target="_blank" rel="noopener noreferrer">{label}</a>
    </li>
    <li class="share-button-list-item">
      <button type="button" class="share-button-copy">{copyLabel}</button>
    </li>
  </ul>
  <p class="share-button-status" aria-live="polite"></p>
</div>
```

The trigger's class is `share-button-trigger`, not `share-button-button`.
The sibling helpers use `{helper}-button`, which here would read
`.share-button-button` — the one place the naming convention is bent, and
deliberately.

### 4.3 Re-exports

`index.ts` exports `default`, `ShareButton`, `canShareNatively`,
`canCopy`, `nextShareButtonId`, `RIGHTWARDS_ARROW_WITH_HOOK`, and the
types `Props`, `ChildArgs`, `ShareTarget`, `ShareStrategy`.

## 5. Behaviour

### 5.1 Activation

`strategy: "auto"` (default) calls `navigator.share({ url, title, text })`
when it exists, and opens the list otherwise. `"native"` always attempts
the sheet. `"list"` never does. When the sheet is used the list does not
open.

### 5.2 Copying

`navigator.clipboard.writeText(url)`. Success fires `onCopy` and, if
supplied, announces `copiedLabel`. Failure — including a browser with no
clipboard API at all — announces `copyFailedLabel` and never throws.
Either way the list closes.

### 5.3 Keyboard

| Key | On the button | In the list |
| --- | ------------- | ----------- |
| `Enter` / `Space` | Activates (native browser behaviour) | Activates the focused item |
| `ArrowDown` | Opens, focuses the first item | Moves focus down, clamping |
| `ArrowUp` | Opens, focuses the last item | Moves focus up, clamping |
| `Home` / `End` | — | First / last item |
| `Escape` | — | Closes and returns focus to the button |
| `Tab` | Moves on | Closes, focus goes where the browser sends it |

Items are real focusable elements, so focus moves for real rather than
via `aria-activedescendant`. Clicking outside, or focus leaving the root,
closes the list.

## 6. Accessibility

WCAG 2.2 AAA target. The glyph is `aria-hidden`; the accessible name is
the button's `aria-label`, which is consumer-supplied and localisable.
The status region is `aria-live="polite"` and empty on load, so it
announces the copy outcome and nothing else. Destinations keep native
link semantics.

Known costs, stated rather than glossed: the control's name rests
**entirely** on `aria-label`, with no visible text fallback; and the
native-sheet path means behaviour differs by platform, so what a user
sees on a phone is not what they see on a desktop.

## 7. Testing acceptance criteria

`ShareButton.test.ts` asserts every clause below.

1. Renders a disclosure `<button>` with `aria-expanded` controlling a `<ul>`.
2. The list is hidden until the button is activated.
3. Destinations are real `<a>` elements with no `role` override, `target="_blank"` and `rel="noopener noreferrer"`.
4. Each destination's `href` comes from its own `href()`.
5. The copy item renders only when `copyLabel` is supplied.
6. The status region is present, polite, and empty on load.
7. Copying writes the URL and fires `onCopy`.
8. A successful copy announces `copiedLabel` and closes the list.
9. A failed copy announces `copyFailedLabel` and does not throw.
10. An absent clipboard API is a failure, not a crash.
11. `canShareNatively()` reflects `navigator.share`.
12. `strategy: "auto"` uses the sheet when available and does not open the list.
13. `strategy: "auto"` falls back to the list with no sheet; `"list"` ignores an available sheet.
14. A dismissed (rejected) sheet does not fall through to the list.
15. Opening focuses the first item; `ArrowDown` / `ArrowUp` on the closed button open focused on first / last.
16. Arrows move focus and clamp; `Home` / `End` jump.
17. `Escape` closes and returns focus to the button.
18. Choosing a destination fires `onShare` with its `id` and closes the list.
19. Clicking outside closes the list.
20. An explicit `url` prop wins.
21. With no `url`, the current page URL is used.
22. `children` replaces the glyph and receives `ChildArgs`.

## 8. Tracking

- Package: lily-design-system-svelte-share-button
- Version: 0.1.0
- License: MIT

---

Lily™ and Lily Design System™ are trademarks.
