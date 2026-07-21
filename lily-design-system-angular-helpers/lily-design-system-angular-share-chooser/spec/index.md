# ShareChooser — Specification

Single source of truth for the `lily-design-system-angular-share-chooser`
Angular helper. This file drives implementation, testing, and
documentation: anything not in this spec is out of scope; anything in
this spec must be exercised by a test.

The canonical cross-framework contract is the Svelte helper's
[spec](../../../lily-design-system-svelte-helpers/lily-design-system-svelte-share-chooser/spec/index.md);
per `AGENTS/helpers.md`, Svelte wins where the catalogs disagree. This
file states the same contract in Angular 20 idiom.

Sibling files:

- `share-chooser.component.ts` — the implementation
- `share-chooser.component.spec.ts` — vitest spec exercising every clause in §7
- `index.ts` — re-export barrel
- `index.md` — user-facing guide
- `docs/accessibility.md` — tradeoffs, stated plainly

---

## 1. Goal

Give an Angular 20 application a drop-in, headless share control that:

1. Renders a single-glyph button (↪, U+21AA) matching the other Lily
   helpers.
2. Uses the **native share sheet** where the browser provides one.
3. Otherwise opens a list of consumer-supplied destinations, plus a
   built-in **copy the page URL** action.
4. Ships zero CSS and zero third-party endpoints.

## 2. Non-goals

- **Shipping a built-in set of social networks.** No URL templates for
  X / Facebook / LinkedIn / Reddit ship with this package. Which
  networks exist is an editorial and privacy decision belonging to the
  consumer, the URLs change, and networks die. The consumer supplies
  `targets`.
- **Bundling brand icons.** `AGENTS/headless.md` forbids bundled icon
  assets; destination labels are text supplied by the consumer.
- **Share counts, analytics, or tracking.** The component reports what
  the user chose via the `share` output; what you do with that is yours.
- **Persistence.** Unlike the three preference helpers, this control has no
  state to remember. Nothing is written to `localStorage`, and nothing
  is applied to the document root.

## 3. Architectural decisions

- **A helper, but not a preference lifecycle.** The other helpers own
  *selection + DOM application + optional persistence*. This one owns an
  *action*: it applies nothing to the document and persists nothing. It
  is a helper because it owns a complete interaction end to end and
  ships the same headless contract. See `AGENTS/helpers.md`.
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
- **Angular-specific: outputs, not callback inputs.** The Svelte helper
  takes `onShare` / `onCopy` / `onNativeShare` props. Angular's idiom is
  `output()`, so this package emits `(share)`, `(copy)` and
  `(nativeShare)` instead. `share` carries a `ShareEvent` object rather
  than two positional arguments, since Angular outputs emit one value.
- **Angular-specific: `class` is `className`.** `class` is not a legal
  Angular input name, so the consumer's extra class hook arrives as
  `className`, matching the sibling helpers.
- **Angular-specific: rejections use `.then(ok, err)`.** Both
  `navigator.share()` and `navigator.clipboard.writeText()` attach their
  rejection handler at the call site rather than relying on `try/await`.
  Under zone.js a rejection caught only by a native `await` is still
  reported as an unhandled error against the originating click task.

## 4. Public API

### 4.1 Inputs / outputs

| Input | Type | Required | Default | Purpose |
| ----- | ---- | -------- | ------- | ------- |
| `label` | `string` | yes | — | Accessible name for the button. |
| `targets` | `ShareTarget[]` | no | `[]` | Destinations to offer. Empty is valid when `copyLabel` is set. |
| `url` | `string` | no | current page URL | URL to share. Resolved lazily, so the default is SSR-safe. |
| `title` | `string` | no | `""` | Passed to `href(...)` and the native sheet. |
| `text` | `string` | no | `""` | Passed to `href(...)` and the native sheet. |
| `copyLabel` | `string` | no | `""` | Label for the copy item. Omit it and no copy item renders. |
| `copiedLabel` | `string` | no | `""` | Announced in the status region after a successful copy. |
| `copyFailedLabel` | `string` | no | `""` | Announced when the clipboard write fails. |
| `strategy` | `"auto" \| "native" \| "list"` | no | `"auto"` | Whether to prefer the native sheet. |
| `className` | `string` | no | `""` | Extra class on the root `<div>`. |

| Output | Payload | Fires |
| ------ | ------- | ----- |
| `share` | `ShareEvent` (`{ targetId, url }`) | A destination was chosen. |
| `copy` | `string` (the URL) | The URL was copied successfully. |
| `nativeShare` | `string` (the URL) | The native sheet was used instead of the list. |

Content projection: a single `<ng-template>` (queried via
`contentChild(TemplateRef)`) replaces the ↪ glyph inside the trigger and
receives `ChildArgs` as both `$implicit` and named properties. The
optional `ShareChooserIcon` marker directive
(`ng-template[lilyShareChooserIcon]`) types the `let-` variables. The
template replaces the **glyph only** — it never renders the list.

```ts
type ShareTarget = {
  id: string;
  label: string;
  href: (url: string, title: string, text: string) => string;
  newTab?: boolean;   // default true
};

type ChildArgs = { open: boolean; url: string };
type ShareStrategy = "auto" | "native" | "list";
type ShareEvent = { targetId: string; url: string };
```

### 4.2 DOM contract

```html
<div class="share-chooser {className}">
  <button type="button" class="share-chooser-button"
          aria-label="{label}" aria-expanded aria-controls="{listId}">
    <span class="share-chooser-icon" aria-hidden="true">↪</span>
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
```

The trigger's class is `share-chooser-button`, following the sibling
helpers' `{helper}-button` convention exactly. (Under the package's
former name this hook had to be `share-button-trigger`, because
`.share-button-button` read badly; the July 2026 rename removed the
need for that exception.)

`@for` is used (not `*ngFor`), tracked by `target.id`. `target="_blank"`
is dropped for a destination whose `newTab` is `false`.

### 4.3 Re-exports

`index.ts` exports `ShareChooser`, `ShareChooserIcon`, `canShareNatively`,
`canCopy`, `nextShareChooserId`, `RIGHTWARDS_ARROW_WITH_HOOK`, and the
types `ChildArgs`, `ShareTarget`, `ShareStrategy`, `ShareEvent`.

`nextShareChooserId()` is an incrementing module counter — stable, unique
per instance, and SSR-safe (no `Math.random`, no `Date.now`). It mints
`share-chooser-{n}`; the list id is that plus `-list`.

## 5. Behaviour

### 5.1 Activation

`strategy: "auto"` (default) calls `navigator.share({ url, title, text })`
when it exists, and opens the list otherwise. `"native"` always attempts
the sheet. `"list"` never does. When the sheet is used the list does not
open. Clicking the trigger while the list is open closes it.

A rejected `navigator.share()` — almost always the user dismissing the
sheet — ends the interaction: the list does **not** open, and
`nativeShare` does not emit.

### 5.2 Copying

`navigator.clipboard.writeText(url)`. Success emits `copy` and, if
supplied, announces `copiedLabel`. Failure — including a browser with no
clipboard API at all — announces `copyFailedLabel` and never throws.
Either way the list closes.

### 5.3 URL resolution

`currentUrl()` is a plain method, not a `computed`, so it is evaluated
lazily at share time: an explicit `url` input wins, otherwise
`location.href` is read if `location` exists. SSR never touches
`location` during rendering.

### 5.4 Open / close

Opening sets `open` and clears the status region, then moves real focus
to the first item (or the last, when opened with `ArrowUp`) in a
`queueMicrotask` so the `hidden` attribute is gone first. Closing
returns focus to the trigger, except when closing via `Tab`, an outside
click, or focus leaving the root — those close without stealing focus
back.

### 5.5 SSR

No `localStorage`, no `data-*` on the document root, no DOM writes
outside event handlers. `canShareNatively()` and `canCopy()` both guard
on `typeof navigator`.

## 6. Accessibility

WCAG 2.2 AAA target. The glyph is `aria-hidden`; the accessible name is
the button's `aria-label`, which is consumer-supplied and localisable.
The status region is `aria-live="polite"` and empty on load, so it
announces the copy outcome and nothing else. Destinations keep native
link semantics.

### 6.1 Keyboard contract

| Key | On the button | In the list |
| --- | ------------- | ----------- |
| `Enter` / `Space` | Activates (native browser behaviour) | Activates the focused item |
| `ArrowDown` | Opens, focuses the first item | Moves focus down, clamping |
| `ArrowUp` | Opens, focuses the last item | Moves focus up, clamping |
| `Home` / `End` | — | First / last item |
| `Escape` | — | Closes and returns focus to the button |
| `Tab` | Moves on | Closes, focus goes where the browser sends it |

Items are real focusable elements, so focus moves for real rather than
via `aria-activedescendant`. Clicking outside, or focus leaving the
root, closes the list.

Known costs, stated rather than glossed: the control's name rests
**entirely** on `aria-label`, with no visible text fallback; and the
native-sheet path means behaviour differs by platform, so what a user
sees on a phone is not what they see on a desktop. Full treatment in
[docs/accessibility.md](../docs/accessibility.md).

## 7. Testing acceptance criteria

`share-chooser.component.spec.ts` asserts every clause below. Each clause
lists the test titles that carry it — the mapping is 1:1 by clause
number, and no clause is unexercised.

### 7.1 Renders a disclosure button controlling a list

- *renders a disclosure button controlling a list* — `<button type="button">`
  with `aria-label`, `aria-expanded="false"`, and `aria-controls` pointing
  at the `<ul>`'s id.
- *the button renders ↪, hidden from assistive tech* — the icon span's
  text is U+21AA, matches `RIGHTWARDS_ARROW_WITH_HOOK`, and is
  `aria-hidden="true"`.

### 7.2 The list is hidden until the button is activated

- *the list is hidden until the button is activated* — `hidden` present
  on load, gone after activation, with `aria-expanded` flipping to
  `"true"`.

### 7.3 Destinations are real links

- *destinations are real links, not role=menuitem* — `<a>` elements with
  no `role`, `target="_blank"`, `rel="noopener noreferrer"`.
- *newTab:false drops target=_blank for that destination*.
- *destinations sit in .share-chooser-list-item children* — one `<li>` per
  destination.

### 7.4 Each destination's href comes from its own `href()`

- *each destination's href comes from its own href()* — with `title`
  threaded through.
- *href() also receives text*.

### 7.5 The copy item renders only when `copyLabel` is supplied

- *no copy item renders when copyLabel is absent*.
- *the copy item renders when copyLabel is supplied* — a real
  `<button type="button">` carrying the supplied label.

### 7.6 The status region is present, polite, and silent on load

- *the status region is present, polite, and silent on load* — a `<p>`
  with `aria-live="polite"` and empty text.

### 7.7 Copying writes the URL and emits `copy`

- *copying writes the URL and emits copy*.

### 7.8 A successful copy announces `copiedLabel` and closes the list

- *a successful copy announces copiedLabel and closes the list*.

### 7.9 A failed copy announces `copyFailedLabel` and does not throw

- *a failed copy announces copyFailedLabel and does not throw*.
- *a failed copy does not emit copy, and still closes the list*.

### 7.10 An absent clipboard API is a failure, not a crash

- *an absent clipboard API is treated as a failure, not a crash*.
- *canCopy reflects navigator.clipboard.writeText*.

### 7.11 `canShareNatively()` reflects `navigator.share`

- *canShareNatively reflects navigator.share*.

### 7.12 `strategy: "auto"` uses the sheet when available and does not open the list

- *strategy=auto uses the sheet when available, and skips the list* —
  `navigator.share` receives `{ url, title, text }`, `nativeShare` emits,
  and the list stays `hidden`.
- *strategy=native attempts the sheet*.

### 7.13 Fallback and opt-out

- *strategy=auto falls back to the list with no native sheet*.
- *strategy=list ignores an available native sheet*.

### 7.14 A dismissed sheet does not fall through to the list

- *a dismissed share sheet does not fall through to the list*.
- *a dismissed share sheet does not emit nativeShare*.

### 7.15 Opening moves focus to an item

- *opening moves focus to the first item*.
- *ArrowDown on the closed button opens and focuses the first item*.
- *ArrowUp on the closed button opens and focuses the last item*.

### 7.16 Arrows move focus and clamp; `Home` / `End` jump

- *ArrowDown moves focus down the list*.
- *ArrowUp moves focus up the list*.
- *ArrowUp clamps at the first item rather than wrapping*.
- *ArrowDown clamps at the last item rather than wrapping*.
- *Home and End jump to the first and last item*.

### 7.17 `Escape` closes and returns focus; `Tab` closes and moves on

- *Escape closes and returns focus to the button*.
- *Tab closes without stealing focus back to the button*.

### 7.18 Choosing a destination emits `share` and closes the list

- *choosing a destination emits share with its id and closes* — the
  payload is `{ targetId, url }`.

### 7.19 Dismissal

- *clicking outside closes the list*.
- *clicking the trigger again closes the list*.
- *focus leaving the root closes the list*.
- *focus moving within the root keeps the list open*.

### 7.20 An explicit `url` input wins

- *an explicit url input wins*.

### 7.21 With no `url`, the current page URL is used

- *with no url input it falls back to the current page URL*.
- *the resolved url is what share reports*.

### 7.22 A projected template replaces the glyph and receives `ChildArgs`

- *a projected ng-template replaces the glyph and receives ChildArgs* —
  the custom node sits inside `.share-chooser-button`, the default
  `.share-chooser-icon` is gone, and the context carries `open` and `url`.
- *the ChildArgs open flag tracks the list state*.

### 7.23 Framework-contract clauses (mirroring §4.2 and §4.3)

Three tests carry §4 rather than §7, and are named for it:

- *§4.2 the trigger's class hook is share-chooser-button*.
- *§4.2 the root carries the base class plus the consumer's class*.
- *§4.3 nextShareChooserId mints unique, stable ids*.

Total: **47 cases**, all green.

## 8. Out-of-scope (future, not implemented here)

- A visible-text variant of the trigger (the consumer can pair the
  button with their own text, or project a template).
- Positioning or animation for the list — the package ships no CSS.
- QR-code or "share to nearby device" affordances.

## 9. Tracking

- Package: lily-design-system-angular-share-chooser
- Version: 0.1.0
- License: MIT

---

Lily™ and Lily Design System™ are trademarks.
