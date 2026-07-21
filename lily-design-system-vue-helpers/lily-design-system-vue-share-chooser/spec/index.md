# ShareChooser — Specification

Single source of truth for the `lily-design-system-vue-share-chooser`
Vue 3 helper. This file drives implementation, testing, and documentation:
anything not in this spec is out of scope; anything in this spec must be
exercised by a test.

A direct port of the canonical
[`lily-design-system-svelte-share-chooser`](../../../lily-design-system-svelte-helpers/lily-design-system-svelte-share-chooser/spec/index.md).
Where the two disagree, the Svelte side wins. The §7 clause numbers are
kept identical across catalogs so the suites cross-reference.

Sibling files:

- `ShareChooser.vue` — the implementation
- `ShareChooser.test.ts` — vitest spec exercising every clause in §7
- `index.ts` — re-export barrel
- `index.md` — user-facing guide

---

## 1. Goal

Give a Vue 3 application a drop-in, headless share control that:

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
  the user chose via the `share` event; what you do with that is yours.
- **Persistence.** Unlike the `*-chooser` preference helpers, this
  control has no state to remember. Nothing is written to `localStorage`.

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
- **This helper is a disclosure, not a listbox.** The three
  `*-chooser` preference helpers in this catalog are APG listboxes with
  `aria-activedescendant` and a virtual active option. This one is not:
  its items are real focusable links and buttons, so focus moves for
  real. The divergence is deliberate and follows from §3's
  "real links, not a menu".

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
| `class` | `string` | no | `""` | Extra class on the root. |
| `$attrs` | any HTML attributes | no | — | Fall through to the root `<div>`. |

### 4.2 Events

The Svelte canonical takes `onShare` / `onCopy` / `onNativeShare`
callback props; the Vue idiom for the same contract is emitted events,
matching how `onChange` maps to `@change` on the `*-chooser` preference
helpers.

| Event | Payload | Fires when |
| ----- | ------- | ---------- |
| `share` | `(targetId: string, url: string)` | A destination is chosen. |
| `copy` | `(url: string)` | The URL was copied successfully. |
| `nativeShare` | `(url: string)` | The native sheet was used instead of the list. Template: `@native-share`. |

There is no `update:value` / `v-model` binding: this helper owns an
action, not a value.

### 4.3 Slot

The default scoped slot replaces the **button glyph** and receives
`SlotArgs`:

```ts
type SlotArgs = { open: boolean; url: string };
```

Slot content renders inside the `<button>`, so it must not be
interactive; the accessible name always comes from `label`.

```ts
type ShareTarget = {
  id: string;
  label: string;
  href: (url: string, title: string, text: string) => string;
  newTab?: boolean;   // default true
};
```

### 4.4 DOM contract

```html
<div class="share-chooser {class}">
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

The trigger's class is `share-chooser-button`, following the same
`{helper}-button` convention as `theme-chooser`, `locale-chooser` and
`text-size-chooser`. (Under the helper's former name this was
`share-button-trigger`, because `.share-button-button` read badly; the
rename to `share-chooser` removed the need for that exception.)

### 4.5 Re-exports

`index.ts` exports `default`, `ShareChooser`, `canShareNatively`,
`canCopy`, `nextShareChooserId`, `RIGHTWARDS_ARROW_WITH_HOOK`, and the
types `Props`, `SlotArgs`, `ChildArgs` (alias of `SlotArgs`),
`ShareTarget`, `ShareStrategy`.

## 5. Behaviour

### 5.1 Activation

`strategy: "auto"` (default) calls `navigator.share({ url, title, text })`
when it exists, and opens the list otherwise. `"native"` always attempts
the sheet. `"list"` never does. When the sheet is used the list does not
open.

### 5.2 Copying

`navigator.clipboard.writeText(url)`. Success emits `copy` and, if
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

### 5.4 Vue-specific implementation notes

- `hidden` is bound as `:hidden="open ? undefined : true"` and
  `aria-expanded` as an explicit `'true'` / `'false'` ternary. Vue 3.5
  normalises raw booleans correctly for both, but the explicit forms
  match the sibling helpers, survive a change of binding target, and
  state the intent in the template.
- `openList` and `closeList` `await nextTick()` before calling
  `.focus()`. A `hidden` element cannot take focus in a real browser,
  so the DOM must flush first. jsdom does not enforce this, so no test
  can catch its removal — the ordering is load-bearing in production
  only.
- The outside-click listener is registered in `onMounted` and removed
  in `onBeforeUnmount`, matching `theme-chooser`.

## 6. Accessibility

WCAG 2.2 AAA target. The glyph is `aria-hidden`; the accessible name is
the button's `aria-label`, which is consumer-supplied and localisable.
The status region is `aria-live="polite"` and empty on load, so it
announces the copy outcome and nothing else. Destinations keep native
link semantics.

Known costs, stated rather than glossed: the control's name rests
**entirely** on `aria-label`, with no visible text fallback; and the
native-sheet path means behaviour differs by platform, so what a user
sees on a phone is not what they see on a desktop. Full treatment in
[docs/accessibility.md](../docs/accessibility.md).

## 7. Testing acceptance criteria

`ShareChooser.test.ts` asserts every clause below.

1. Renders a disclosure `<button>` with `aria-expanded` controlling a `<ul>`.
2. The list is hidden until the button is activated.
3. Destinations are real `<a>` elements with no `role` override, `target="_blank"` and `rel="noopener noreferrer"`; `newTab: false` drops `target` for that destination only.
4. Each destination's `href` comes from its own `href()`.
5. The copy item renders only when `copyLabel` is supplied.
6. The status region is present, polite, and empty on load.
7. Copying writes the URL and emits `copy`.
8. A successful copy announces `copiedLabel` and closes the list.
9. A failed copy announces `copyFailedLabel` and does not throw.
10. An absent clipboard API is a failure, not a crash.
11. `canShareNatively()` reflects `navigator.share`.
12. `strategy: "auto"` uses the sheet when available and does not open the list.
13. `strategy: "auto"` falls back to the list with no sheet; `"list"` ignores an available sheet; `"native"` always attempts it.
14. A dismissed (rejected) sheet does not fall through to the list, and emits no `nativeShare`.
15. Opening focuses the first item; `ArrowDown` / `ArrowUp` on the closed button open focused on first / last.
16. Arrows move focus and clamp; `Home` / `End` jump.
17. `Escape` closes and returns focus to the button; `Tab` closes without stealing focus back.
18. Choosing a destination emits `share` with its `id` and closes the list.
19. Clicking outside, re-clicking the trigger, or moving focus out of the root closes the list.
20. An explicit `url` prop wins.
21. With no `url`, the current page URL is used — for destinations and for the native sheet.
22. The default slot replaces the glyph and receives `SlotArgs`, whose `open` tracks the list state.

In addition, §4.2's root contract (class hook + consumer `class` +
`$attrs` fall-through) is asserted directly.

## 8. Tracking

- Package: lily-design-system-vue-share-chooser
- Version: 0.1.0
- License: MIT
- Ported from: `lily-design-system-svelte-share-chooser` 0.1.0

---

Lily™ and Lily Design System™ are trademarks.
