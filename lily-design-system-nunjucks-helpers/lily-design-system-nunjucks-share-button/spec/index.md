# ShareButton (Nunjucks) — Specification

Single source of truth for the `lily-design-system-nunjucks-share-button`
helper. This file drives implementation, testing, and documentation:
anything not in this spec is out of scope; anything in this spec must be
exercised by a test.

The canonical helper is the Svelte one
([`../../../lily-design-system-svelte-helpers/lily-design-system-svelte-share-button/spec/index.md`](../../../lily-design-system-svelte-helpers/lily-design-system-svelte-share-button/spec/index.md)).
Per `AGENTS/helpers.md`, Svelte wins where the catalogs disagree; §3.3
below records the one place this port could not follow it, and why.

Sibling files:

- `share-button.njk` — the macro (server-rendered markup)
- `share-button.client.js` — the runtime (interaction, native sheet, clipboard)
- `share-button.test.ts` — vitest spec exercising every clause in §7
- `index.md` — user-facing guide

---

## 1. Goal

Give a Nunjucks application a drop-in, headless share control that:

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
- **Share counts, analytics, or tracking.**
- **Persistence.** Unlike the `*-select` helpers, this control has no
  state to remember. Nothing is written to `localStorage`, and nothing
  is applied to the document root.

## 3. Architectural decisions

### 3.1 Inherited from the canonical helper

- **A helper, but not a preference lifecycle.** The other helpers own
  *selection + DOM application + optional persistence*. This one owns an
  *action*.
- **Disclosure + real links, not a menu.** Share destinations are
  navigation, so they render as real `<a>` elements with **no `role`
  override**. `role="menuitem"` would strip middle-click,
  open-in-new-tab and copy-link-address — real affordances users rely on
  for exactly this kind of list. The WAI-ARIA APG itself suggests a
  disclosure when the items are links. Copy is a genuine action, so it
  is a `<button>`.
- **No default copy label.** The copy item renders only when
  `copyLabel` is supplied, because a default would be a hardcoded
  English string — see `AGENTS/internationalization.md`.
- **A dismissed native sheet is not a failure.** `navigator.share()`
  rejects when the user dismisses the sheet. Falling back to the list
  there would resurrect UI the user just dismissed, so a rejection ends
  the interaction.
- **The trigger class is `share-button-trigger`**, not
  `share-button-button`. The sibling helpers use `{helper}-button`,
  which here would read `.share-button-button` — the one place the
  naming convention is bent, and deliberately.

### 3.2 The macro / client.js split

As with every helper in this catalog, the macro renders markup carrying
`data-lily-share-button-*` hooks and the client module wires behaviour.
The split here falls in an unusually good place: the macro emits the
destination anchors **fully formed**, so they are useful before — and
without — the client. See §6 and `docs/ssr.md`.

### 3.3 DEVIATION — `href` is a string in the macro, a function on the client

The canonical Svelte helper types a target's `href` as:

```ts
href: (url: string, title: string, text: string) => string;
```

so the consumer builds the whole URL and no endpoint or query-parameter
convention is baked in.

**A Nunjucks macro cannot call an arbitrary JavaScript function.**
Templates may call filters and globals registered on the environment,
and nothing else; a function passed through `opts` renders as the empty
string. There is no way to honour the canonical signature in the
template without requiring every consumer to register a custom filter
first, which would make the helper un-droppable-in and put an escaping
hazard in the consumer's hands.

**Resolution.** The macro takes each target's `href` as an
**already-resolved string**:

```js
{ id: "mastodon", label: "Mastodon", href: "https://…", newTab: true }
```

This is a deviation from the canonical API, and it is recorded as such
in `CHANGELOG.md` and `index.md`. Three things make it the right trade:

1. The consumer is rendering server-side and **already holds** `url`,
   `title` and `text` — they are building the page. Calling their own
   URL-builder one line earlier costs them nothing.
2. The rendered anchors carry real, final hrefs, which is exactly what
   makes the no-JS story work (§6). A function-based macro API could
   not have produced them at all.
3. Nothing about the *contract* changes: the consumer still owns the
   whole URL, and still no endpoint convention ships.

**The function form survives on the client**, where functions are
callable. `initShareButton(root, {targets})` accepts targets whose
`href` is a function, matches them to the rendered anchors by
`data-target-id`, and rewrites each `href` from the live URL — at init
and again on every open. `shareTargetHref(target, url, title, text)` is
exported as the pure resolver and accepts **both** forms, so one
`targets` array can feed the template and the module.

## 4. Public API

### 4.1 Macro parameters

`{% from "./share-button.njk" import shareButton %}` →
`{{ shareButton(opts) }}`

| Key | Type | Required | Default | Purpose |
| --- | ---- | -------- | ------- | ------- |
| `label` | string | yes | — | Accessible name for the trigger. Glyph-only button, so this is its **only** name. |
| `targets` | array | no | `[]` | Destinations. Empty is valid when `copyLabel` is set. |
| `url` | string | no | — | URL to share. Emitted as a data attribute; the client falls back to `location.href`. |
| `title` | string | no | `""` | Passed to the native sheet. |
| `text` | string | no | `""` | Passed to the native sheet. |
| `copyLabel` | string | no | — | Label for the copy item. Omit it and no copy item renders. |
| `copiedLabel` | string | no | — | Announced after a successful copy. |
| `copyFailedLabel` | string | no | — | Announced when the clipboard write fails. |
| `strategy` | `"auto"｜"native"｜"list"` | no | `"auto"` | Whether to prefer the native sheet. |
| `name` | string | no | `"share"` | Discriminator used to derive ids. |
| `id` | string | no | `share-button-{name}` | Id prefix for the list and items. |
| `classes` | string | no | — | Extra classes on the root. |
| `attributes` | object | no | — | Extra HTML attributes spread onto the root. |
| `{% call %}` body | — | no | the ↪ glyph | Replaces the glyph inside the button. |

Each entry in `targets`:

| Key | Type | Required | Default | Purpose |
| --- | ---- | -------- | ------- | ------- |
| `id` | string | yes | — | Stable identifier, passed back to `onShare`. |
| `label` | string | yes | — | Visible link text. |
| `href` | string | yes | — | The full destination URL. **See §3.3.** |
| `newTab` | boolean | no | `true` | `false` renders the link without `target="_blank"`. |

### 4.2 DOM contract

```html
<div class="share-button {classes}" data-lily-share-button-root …>
  <button type="button" class="share-button-trigger" aria-label="{label}"
          aria-expanded="false" aria-controls="{id}-list"
          data-lily-share-button-trigger>
    <span class="share-button-icon" aria-hidden="true">&#8618;</span>
  </button>
  <ul class="share-button-list" id="{id}-list" hidden data-lily-share-button-list>
    <li class="share-button-list-item">
      <a class="share-button-target" id="{id}-target-{i}" data-target-id="{id}"
         href="{href}" target="_blank" rel="noopener noreferrer">{label}</a>
    </li>
    <li class="share-button-list-item">
      <button type="button" class="share-button-copy" id="{id}-copy"
              data-lily-share-button-copy>{copyLabel}</button>
    </li>
  </ul>
  <p class="share-button-status" aria-live="polite"
     data-lily-share-button-status></p>
</div>
```

Ids are deterministic and SSR-safe: `{id}-list`, `{id}-target-{i}`,
`{id}-copy`, where `id` defaults to `share-button-{name}`. Two instances
sharing a `name` need an explicit distinct `id`.

The list is rendered `hidden`; nothing server-side removes it.

### 4.3 client.js exports

`initShareButton`, `autoInit`, `canShareNatively`, `canCopy`,
`nextShareButtonId`, `shareTargetHref`, `RIGHTWARDS_ARROW_WITH_HOOK`.

`initShareButton(root, opts?)` opts: `url`, `title`, `text`, `strategy`,
`targets`, `copiedLabel`, `copyFailedLabel`, `onShare(id, url)`,
`onCopy(url)`, `onNativeShare(url)`. Init opts win over the rendered
attributes. Returns `{open, close, copy, refreshHrefs, destroy}`.

## 5. Behaviour

### 5.1 Activation

`strategy: "auto"` (default) calls `navigator.share({url, title, text})`
when it exists, and opens the list otherwise. `"native"` always attempts
the sheet. `"list"` never does. When the sheet is used the list does not
open.

### 5.2 Copying

`navigator.clipboard.writeText(url)`. Success fires `onCopy` and, if
supplied, announces `copiedLabel`. Failure — including a browser with no
clipboard API at all — announces `copyFailedLabel` and never throws.
Either way the list closes.

### 5.3 Keyboard

| Key | On the trigger | In the list |
| --- | -------------- | ----------- |
| `Enter` / `Space` | Activates (native browser behaviour) | Activates the focused item |
| `ArrowDown` | Opens, focuses the first item | Moves focus down, clamping |
| `ArrowUp` | Opens, focuses the last item | Moves focus up, clamping |
| `Home` / `End` | — | First / last item |
| `Escape` | — | Closes and returns focus to the trigger |
| `Tab` | Moves on | Closes, focus goes where the browser sends it |

Items are real focusable elements, so focus moves for real rather than
via `aria-activedescendant`. Clicking outside, or focus leaving the root,
closes the list.

## 6. Degradation without JavaScript

The macro's output is **partially operable** with no client module —
which is a materially better story than the `*-select` helpers in this
catalog, and the spec says so on purpose:

- **The destination links work.** They are real `<a href>` elements with
  final URLs, so they navigate, middle-click, open-in-new-tab and
  copy-link-address exactly like any other link.
- **The list cannot be opened.** It is rendered `hidden` and only the
  client removes that, so the links are unreachable through the control
  itself.
- **Copy does not function.** It is a `<button>` with no handler.
- **The native sheet is never reached.**

Stated plainly in `docs/ssr.md`.

## 7. Testing acceptance criteria

`share-button.test.ts` asserts every clause below. Clauses 1–22 map 1:1
onto the canonical Svelte spec's §7; 23–26 cover the Nunjucks-specific
surface.

1. Renders a disclosure `<button>` with `aria-expanded` controlling a `<ul>`.
2. The list is hidden until the button is activated.
3. Destinations are real `<a>` elements with no `role` override, `target="_blank"` and `rel="noopener noreferrer"`.
4. Each destination's `href` is the string the consumer supplied.
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
15. Opening focuses the first item; `ArrowDown` / `ArrowUp` on the closed trigger open focused on first / last.
16. Arrows move focus and clamp; `Home` / `End` jump.
17. `Escape` closes and returns focus to the trigger.
18. Choosing a destination fires `onShare` with its `id` and closes the list.
19. Clicking outside closes the list.
20. An explicit `url` opt wins.
21. With no `url`, the current page URL is used.
22. A `{% call %}` body replaces the glyph.
23. Ids are deterministic, derived from `name` / `id`, and wired to `aria-controls`.
24. `newTab: false` drops `target="_blank"` and keeps `rel`.
25. `shareTargetHref` resolves both the function and string forms; a throwing function yields `""`.
26. Client `targets` with function `href`s re-resolve the rendered anchors; `autoInit` wires every root.

## 8. Tracking

- Package: lily-design-system-nunjucks-share-button
- Version: 0.1.0
- License: MIT

---

Lily™ and Lily Design System™ are trademarks.
