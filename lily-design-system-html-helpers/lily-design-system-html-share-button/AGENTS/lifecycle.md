# Lifecycle — `<share-button>` (HTML helper)

## `connectedCallback`

1. `#render()` — build the light-DOM subtree.
2. Attach the document-level click listener used for outside-click
   dismissal.

Notably **absent** compared to the `*-select` helpers: there is no
initial-value resolution step, no `localStorage` read, no
system-preference detection, and no "apply on connect". This helper owns
an action, not a preference, so there is no state to restore.

## `attributeChangedCallback`

The routing table is the load-bearing part of this element. Three
buckets:

| Bucket | Attributes | Reaction |
| ------ | ---------- | -------- |
| Structural | `label`, `copy-label`, `class` | `#render()` |
| State-carrying | `url`, `share-title`, `text` | `#syncState()` |
| Action-time only | `copied-label`, `copy-failed-label`, `strategy` | none |

- **Structural** attributes change *which elements exist*. `copy-label`
  gates whether the copy `<li>` is created at all; `label` and `class`
  are simple enough to sync but are grouped here because they are rare
  and a rebuild is harmless.
- **State-carrying** attributes only change attribute *values* on
  elements that already exist. They must not rebuild: a rebuild while
  the list is open destroys focus.
- **Action-time** attributes are read when the user acts. Nothing
  rendered depends on them, so reacting would be wasted work.

Assigning the `targets` property also triggers `#render()`.

## `disconnectedCallback`

Removes the document click listener. Nothing else to clean up — no
timers (there is no typeahead here), and no managed `<link>` to
garbage-collect the way `theme-select` has.

## `#render()` vs `#syncState()`

**Do not collapse these.** The split is why a state change never
destroys focus inside an open list.

### `#render()`

- Bails when `!this.isConnected`.
- **Closes the list first** (`#open = false`, `#status = ""`) — a
  structural rebuild cannot preserve focus, so pretending otherwise
  would strand the user's focus on a detached node.
- Builds `div.share-button` → trigger → `ul.share-button-list` (with one
  `li` per target, plus the optional copy `li`) → `p.share-button-status`.
- Caches element references, then `this.replaceChildren(root)`.

### `#syncState()`

- Bails when `#rootEl` is null.
- Writes, in place: `aria-expanded`; the list's `hidden`; each
  destination's `href` (recomputed from `currentUrl()`, `shareTitle`,
  `text`); the status text; and the trigger's content via
  `renderButtonContent()`.
- Creates and destroys **nothing**, so focus inside the list survives.

Re-running `renderButtonContent()` on every sync is what makes the hook
behave like the reactive `children` snippet in Svelte/React/Vue — a
subclass reading `this.open` stays current. Focus lives on a list item
while open, never inside the trigger, so replacing the trigger's
children is safe.

## Open / close

```
openList(focusLast?)   → no-op if items() is empty
                       → #open = true, clear status, #syncState()
                       → focus first (or last) item

closeList(refocus = true) → no-op if already closed
                          → #open = false, #syncState()
                          → focus the trigger unless refocus === false
```

`#syncState()` runs **before** the focus call, so `hidden` is already
removed and the target is focusable. Focus moves for real; there is no
`aria-activedescendant` here, unlike the catalog's listbox helpers.

`refocus: false` is used for `Tab`, outside-click, and focus-out — cases
where focus is already going somewhere the user chose, and yanking it
back to the trigger would be hostile.

## The deferred focus-out check

```ts
#onRootFocusOut = (event: FocusEvent): void => {
    const next = event.relatedTarget as Node | null;
    if (next && this.#rootEl?.contains(next)) return;
    queueMicrotask(() => {
        const active = document.activeElement;
        if (active && this.#rootEl?.contains(active)) return;
        this.closeList(false);
    });
};
```

Two guards, and both are needed:

1. The fast path: a `relatedTarget` inside the root means focus is
   moving *within* the control — do nothing.
2. The deferred path: some engines (and jsdom) dispatch `focusout` with
   a **null** `relatedTarget` before the new focus target is committed.
   Closing eagerly there would close the list while focus was still
   moving into it. Re-reading `document.activeElement` a microtask later
   sees the settled state.

This is the same shape `theme-select` uses. A test asserts both
directions: focus genuinely leaving closes the list, and a `focusout`
whose focus never actually left does not.

## Async handlers

`#onButtonClick` and `#copyUrl` are `async`. Two consequences worth
knowing when testing:

- With no native sheet, `#onButtonClick` never reaches an `await`, so
  the list opens **synchronously** within the click dispatch. The
  document-level outside-click listener therefore sees `#open === true`
  with the trigger as target — inside the root, so it does not
  immediately re-close.
- With a native sheet stubbed, or for any copy, the work settles after a
  microtask turn. Tests must `await flush()`.
