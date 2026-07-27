# `<share-chooser>` — Specification

Single source of truth for the `lily-design-system-html-share-chooser`
HTML helper. This file drives implementation, testing, and
documentation: anything not in this spec is out of scope; anything in
this spec must be exercised by a test.

Ported from the canonical Svelte helper
[`lily-design-system-svelte-share-chooser`](../../../lily-design-system-svelte-helpers/lily-design-system-svelte-share-chooser/spec/index.md).
Per [`AGENTS/helpers.md`](../../../AGENTS/helpers.md) the Svelte side
wins on behaviour; this file records the vanilla-custom-element idiom
and the two places the API shape could not be carried over verbatim
(§4.1 `share-title`, §4.3 property-only members).

Sibling files:

- `share-chooser.ts` — the implementation (custom-element class)
- `share-chooser.test.ts` — vitest + jsdom spec exercising every clause in §7
- `index.ts` — barrel re-export + side-effectful registration
- `index.md` — user-facing guide
- `docs/accessibility.md` — tradeoffs, stated plainly

---

## 1. Goal

Give any HTML page a drop-in, headless share control that:

1. Renders a single-glyph button (➤, U+27A4) matching the other Lily
   helpers.
2. Uses the **native share sheet** where the browser provides one.
3. Otherwise opens a disclosure list of consumer-supplied destinations,
   plus a built-in **copy the page URL** action.
4. Ships zero CSS and zero third-party endpoints.

## 2. Non-goals

- **Shipping a built-in set of social networks.** No URL templates for
  X / Facebook / LinkedIn / Reddit ship with this package. Which
  networks exist is an editorial and privacy decision belonging to the
  consumer, the URLs change, and networks die. The consumer supplies
  `targets`.
- **Bundling brand icons.** `AGENTS/headless.md` forbids bundled icon
  assets; destination labels are text supplied by the consumer.
- **Share counts, analytics, or tracking.** The element reports what the
  user chose via `onShare` / the `share` event; what you do with that is
  yours.
- **Persistence.** Unlike the preference helpers, this control has no
  state to remember. Nothing is written to `localStorage`, and nothing
  is applied to the document root.

## 3. Architectural decisions

- **A helper, but not a preference lifecycle.** The other helpers own
  *selection + DOM application + optional persistence*. This one owns an
  *action*: it applies nothing to the document and persists nothing. It
  is a helper because it owns a complete interaction end to end and
  ships the same headless contract. See `AGENTS/helpers.md`.
- **Disclosure + real links, not a menu, and not the catalog's
  listbox.** The three preference helpers in this catalog render an icon
  button opening a `role="listbox"`. This helper deliberately does not.
  Share destinations are navigation, so they render as real `<a>`
  elements. `role="menuitem"` — or an `<li role="option">` listbox —
  would strip middle-click, open-in-new-tab and copy-link-address, real
  affordances users rely on for exactly this kind of list. The WAI-ARIA
  APG itself suggests a disclosure when the items are links. Copy is a
  genuine action, so it is a `<button>`.
- **Real focus, not `aria-activedescendant`.** Because the items are
  real focusable elements, arrow keys move real focus. This is the other
  half of the divergence from the catalog's listbox helpers, where focus
  stays on the `<ul>`.
- **`href` is a function, not a template string.** The consumer builds
  the whole URL and owns any encoding, so no endpoint or query-parameter
  convention is baked in. This is also why `targets` is property-only
  (§4.3).
- **No default copy label.** The copy item renders only when
  `copy-label` is supplied, because a default would be a hardcoded
  English string — see `AGENTS/internationalization.md`.
- **A dismissed native sheet is not a failure.** `navigator.share()`
  rejects when the user dismisses the sheet. Falling back to the list
  there would resurrect UI the user just dismissed, so a rejection ends
  the interaction.
- **Light DOM, no Shadow DOM.** As with the sibling helpers, the
  consumer's CSS reaches the rendered markup through the kebab-case
  class hooks directly.

## 4. Public API

### 4.1 Observed attributes

| Attribute | Type | Required | Default | Purpose |
| --------- | ---- | -------- | ------- | ------- |
| `label` | string | yes | `""` | Accessible name for the trigger. |
| `url` | string | no | current page URL | URL to share. Resolved lazily (§5.1). |
| `share-title` | string | no | `""` | Passed to `href(...)` and the native sheet. |
| `text` | string | no | `""` | Passed to `href(...)` and the native sheet. |
| `copy-label` | string | no | — | Label for the copy item. Omit it and no copy item renders. |
| `copied-label` | string | no | — | Announced in the status region after a successful copy. |
| `copy-failed-label` | string | no | — | Announced when the clipboard write fails. |
| `strategy` | `auto` \| `native` \| `list` | no | `auto` | Whether to prefer the native sheet. An unrecognised value falls back to `auto`. |
| `class` | string | no | `""` | Extra class on the rendered root `<div>`. |

**`share-title`, not `title` — the one unavoidable rename.** The
cross-framework prop table calls this `title`. In a custom element that
name is already taken: `title` is a global HTML attribute and an
`HTMLElement` property, so observing it would paint a native tooltip
over the whole control and shadow a platform member. The attribute is
therefore `share-title` and the property `shareTitle`. `el.title`
continues to mean what it means everywhere else in HTML. This is the
only deviation from the canonical prop names.

### 4.2 JS properties

Every attribute above has a mirrored property in camelCase
(`label`, `url`, `shareTitle`, `text`, `copyLabel`, `copiedLabel`,
`copyFailedLabel`, `strategy`). Writing the property writes the
attribute; reading it reads the attribute.

Read-only: `open` (is the list open?), `status` (current live-region
text), `listId` (id of the rendered `<ul>`).

### 4.3 Property-only members

Two parts of the canonical API cannot be attributes, because attributes
are strings and these carry functions:

| Member | Why it cannot be an attribute | Paired event |
| ------ | ----------------------------- | ------------ |
| `targets: ShareTarget[]` | `ShareTarget.href` is a **function**. A JSON attribute could not carry it, and a string-template form would bake in the URL convention this package refuses to own (§2). | — |
| `onShare(targetId, url)` | Function-valued callback. | `share` |
| `onCopy(url)` | Function-valued callback. | `copy` |
| `onNativeShare(url)` | Function-valued callback. | `nativeshare` |

The three callbacks are conveniences; the **events are the primary
contract**, matching how `theme-chooser` exposes `themechange` and
`locale-chooser` exposes `localechange`. Consumers who never touch JS
properties can wire everything with `addEventListener`. Consumers who
hold an element reference may prefer the callback. Both fire, callback
first.

```ts
type ShareTarget = {
  id: string;
  label: string;
  href: (url: string, title: string, text: string) => string;
  newTab?: boolean;   // default true
};
```

### 4.4 Public methods

| Method | Purpose |
| ------ | ------- |
| `openList(focusLast = false)` | Open the list, focusing the first (or last) item. No-op when there is nothing to show. |
| `closeList(refocus = true)` | Close the list, returning focus to the trigger unless `refocus` is false. |
| `items()` | Every focusable item in the list, in DOM order. |
| `currentUrl()` | The URL that would be shared right now (§5.1). |
| `renderButtonContent()` | Overridable hook building the trigger's content (§4.7). |

### 4.5 Events

| Event | Detail | Fires when |
| ----- | ------ | ---------- |
| `share` | `{ targetId, url }` | A destination is chosen. |
| `copy` | `{ url }` | The URL is successfully copied. |
| `nativeshare` | `{ url }` | The native sheet handled the share. |

All three are `CustomEvent`s with `bubbles: true` and `composed: true`,
per the catalog convention.

A dismissed native sheet fires **nothing** — it is neither a success nor
an error (§5.3).

### 4.6 DOM contract

```html
<share-chooser label="Share" url="…">
  <div class="share-chooser {class}">
    <button type="button" class="share-chooser-button"
            aria-label="{label}" aria-expanded="false" aria-controls="{listId}">
      <span class="share-chooser-icon" aria-hidden="true">&#10148;</span>
    </button>
    <ul class="share-chooser-list" id="{listId}" hidden>
      <li class="share-chooser-list-item">
        <a class="share-chooser-target" data-target-id="{id}" href="{href(...)}"
           target="_blank" rel="noopener noreferrer">{label}</a>
      </li>
      <li class="share-chooser-list-item">
        <button type="button" class="share-chooser-copy">{copyLabel}</button>
      </li>
    </ul>
    <p class="share-chooser-status" aria-live="polite"></p>
  </div>
</share-chooser>
```

Three things that are not negotiable:

1. **Disclosure, not menu or listbox.** Destinations are real `<a>`
   elements with **no `role` override**.
2. **The trigger class is `share-chooser-button`**, following the
   catalog's `{helper}-button` convention with no exception.
3. **`target="_blank" rel="noopener noreferrer"`** on destinations
   unless the target sets `newTab: false`. `rel` is kept either way.

There is no hidden `<input>`: unlike the preference helpers this control
carries no value and does not participate in forms.

### 4.7 `renderButtonContent()` — the custom-rendering hook

Light DOM has no `<slot>`, so subclassing stands in for the `children` /
slot the other frameworks expose. Override `renderButtonContent()` to
replace the glyph; whatever it returns is placed inside the trigger.

It receives the same information the other frameworks pass as
`ChildArgs`: `this.open` and `this.currentUrl()` are both readable. The
hook re-runs on every state sync, so a subclass that reads either stays
current. The trigger's own aria wiring is not the subclass's to change.

### 4.8 Re-exports

`index.ts` exports `ShareChooser`, `canShareNatively`, `canCopy`,
`nextShareChooserId`, `BLACK_RIGHTWARDS_ARROWHEAD`, and the types
`ShareChooserProps`, `ShareChooserShareDetail`, `ShareChooserUrlDetail`,
`ShareTarget`, `ShareStrategy`. Importing it registers `<share-chooser>`.

## 5. Behaviour

### 5.1 URL resolution

`currentUrl()` returns the `url` attribute when set, and otherwise
`location.href`. It is resolved **lazily**, at the moment a share
happens or a href is built, so importing the module under SSR never
touches `location`.

### 5.2 Activation

`strategy="auto"` (default) calls `navigator.share({ url, title, text })`
when it exists, and opens the list otherwise. `"native"` always attempts
the sheet. `"list"` never does. When the sheet is used the list does not
open.

### 5.3 The dismissed sheet

`navigator.share()` rejects when the user dismisses the sheet. The
rejection is swallowed, no event fires, no callback runs, and the list
**does not** open. The interaction is over.

### 5.4 Copying

`navigator.clipboard.writeText(url)`. Success fires `onCopy` and the
`copy` event and, if supplied, announces `copied-label`. Failure —
including a browser with no clipboard API at all — announces
`copy-failed-label` and never throws. Either way the list closes.

### 5.5 Reactivity: the `#render` / `#syncState` split

This is the load-bearing part of the port.

- **`#render()`** rebuilds the whole light-DOM subtree. It cannot
  preserve focus inside an open list, so it closes the list first. It
  runs on connect and for the **structural** attributes: `label`,
  `copy-label` (which gates whether the copy item exists at all), and
  `class`; plus assignment to `targets`.
- **`#syncState()`** writes attributes in place on elements that already
  exist: `aria-expanded`, the list's `hidden`, each destination's
  `href`, the status text, and the trigger's content. It never creates
  or destroys a node, so **a state change never destroys focus inside an
  open list**. It runs on open/close, on announce, and for the
  non-structural attributes: `url`, `share-title`, `text`.
- `copied-label`, `copy-failed-label` and `strategy` trigger neither:
  nothing rendered depends on them, and they are read at action time.

### 5.6 Keyboard

| Key | On the trigger | In the list |
| --- | -------------- | ----------- |
| `Enter` / `Space` | Activates (native button behaviour) | Activates the focused item (native) |
| `ArrowDown` | Opens, focuses the first item | Moves focus down, **clamping** |
| `ArrowUp` | Opens, focuses the last item | Moves focus up, **clamping** |
| `Home` / `End` | — | First / last item |
| `Escape` | — | Closes, returns focus to the trigger |
| `Tab` | Moves on | Closes, focus goes where the browser sends it |

Arrows clamp rather than wrap: the ends of a short disclosure list are a
real boundary, and wrapping disorients.

Clicking outside, or focus leaving the root, closes the list. The
focus-out check is **deferred to a microtask** and re-reads
`document.activeElement`, because some engines (and jsdom) dispatch
`focusout` with a null `relatedTarget` before the new focus target is
committed — closing eagerly there would close the list while focus was
still moving inside it.

### 5.7 SSR / no-JS

The module has no top-level DOM access and is import-safe without
`customElements`. Before upgrade the element is empty, so nothing
renders and nothing breaks; the control appears on upgrade. Because it
is an action rather than a preference, there is no first-paint flicker
problem to solve and no cookie/inline-script dance — the notable
simplification against `theme-chooser`.

## 6. Accessibility

WCAG 2.2 AAA target. The glyph is `aria-hidden`; the accessible name is
the trigger's `aria-label`, consumer-supplied and localisable. The
status region is `aria-live="polite"` and empty on load, so it announces
the copy outcome and nothing else. Destinations keep native link
semantics.

Known costs are recorded honestly in
[`docs/accessibility.md`](../docs/accessibility.md): the name rests
entirely on `aria-label` with no visible fallback; behaviour differs by
platform under `strategy="auto"`; the glyph is font-dependent; and copy
can fail for reasons invisible to the user.

## 7. Testing acceptance criteria

`share-chooser.test.ts` asserts every clause below. Test names are
prefixed with the clause number so a reviewer can spot a gap.

1. Renders a disclosure `<button>` with `aria-expanded` controlling a `<ul>`.
2. The list is hidden until the button is activated.
3. Destinations are real `<a>` elements with no `role` override, `target="_blank"` and `rel="noopener noreferrer"`.
4. Each destination's `href` comes from its own `href()`.
5. The copy item renders only when `copy-label` is supplied.
6. The status region is present, polite, and empty on load.
7. Copying writes the URL and fires `onCopy` / the `copy` event.
8. A successful copy announces `copied-label` and closes the list.
9. A failed copy announces `copy-failed-label` and does not throw.
10. An absent clipboard API is a failure, not a crash.
11. `canShareNatively()` reflects `navigator.share`.
12. `strategy="auto"` uses the sheet when available and does not open the list.
13. `strategy="auto"` falls back to the list with no sheet; `"list"` ignores an available sheet; `"native"` always attempts.
14. A dismissed (rejected) sheet does not fall through to the list.
15. Opening focuses the first item; `ArrowDown` / `ArrowUp` on the closed trigger open focused on first / last.
16. Arrows move focus and clamp; `Home` / `End` jump.
17. `Escape` closes and returns focus to the trigger; `Tab` closes without stealing it.
18. Choosing a destination fires `onShare` with its `id` and closes the list.
19. Clicking outside, or focus leaving the root, closes the list.
20. An explicit `url` attribute wins.
21. With no `url`, the current page URL is used.
22. `renderButtonContent()` replaces the glyph, sees `open` + `currentUrl()`, and keeps the base aria wiring.

Beyond the §7 clauses the suite also covers this catalog's idiom:
attribute/property mirroring, `targets` being property-only, the
`share-title` rename, the `#render` / `#syncState` split holding focus,
the absence of any persistence, listener cleanup on disconnect, and SSR
import safety.

## 8. Out-of-scope (future, not implemented here)

- A `navigator.canShare(...)` pre-flight for file / non-URL payloads.
- Sharing files or blobs; only `{ url, title, text }` is passed.
- A declarative attribute form of `targets` (see §4.3 for why).

## 9. Tracking

- Package: lily-design-system-html-share-chooser
- Version: 0.1.0
- License: MIT

---

Lily™ and Lily Design System™ are trademarks.
