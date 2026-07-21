# Testing — `<share-button>` (HTML helper)

The suite lives in [`../share-button.test.ts`](../share-button.test.ts)
and asserts every numbered clause in
[`../spec/index.md` §7](../spec/index.md#7-testing-acceptance-criteria).
Test names are prefixed with the clause number (`§7.14 a dismissed share
sheet …`) so a reviewer can spot a gap. Catalog-wide rules:
[`../../AGENTS/testing.md`](../../AGENTS/testing.md).

52 cases as of 0.1.0.

## Harness

```ts
if (typeof customElements !== "undefined" && !customElements.get("share-button")) {
    customElements.define("share-button", ShareButton);
}

function mount(
    attrs: Record<string, string>,
    { targets = TARGETS, tag = "share-button" }: MountOptions = {},
): ShareButton {
    const el = document.createElement(tag) as ShareButton;
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    el.targets = targets;          // property-only — see AGENTS/api.md
    document.body.appendChild(el);
    return el;
}
```

Assigning `targets` **before** `appendChild` means the first render
already has them; the setter's `#render()` no-ops while disconnected.

Query helpers: `trigger()`, `list()`, `links()`, `copyItem()`,
`statusRegion()`, `items()`. Event helpers: `press(el, key)`,
`click(el)`. Plus `flush()` awaiting a macrotask.

## Swallow navigation

Destinations are real `<a target="_blank">` elements — that is the whole
point of §7.3 — and jsdom does not implement navigation. Without a guard
every click on a destination sprays `Not implemented: navigation` at the
console:

```ts
function swallowNavigation(event: MouseEvent): void {
    if ((event.target as HTMLElement | null)?.closest?.("a[href]")) event.preventDefault();
}
beforeEach(() => document.addEventListener("click", swallowNavigation));
afterEach(() => document.removeEventListener("click", swallowNavigation));
```

This is a harness concern only. Do **not** move the `preventDefault`
into the element: the links are genuinely navigable in a browser, and
that is the feature.

## Both capabilities start absent

jsdom ships neither `navigator.share` nor `navigator.clipboard`. Delete
them in `beforeEach` and `afterEach` so "no native sheet" and "no
clipboard" are *asserted* states rather than assumed ones — §7.10 and
§7.13 depend on it.

```ts
beforeEach(() => {
    document.body.replaceChildren();
    delete (navigator as any).share;
    delete (navigator as any).clipboard;
});
```

`stubClipboard(succeed?)` and `stubNativeShare("resolve" | "reject")`
install fakes via `Object.defineProperty(..., { configurable: true })`
and return a `restore()`. Always restore.

## Timing

- `connectedCallback` runs synchronously on `appendChild`, but
  `await flush()` before asserting so deferred handlers settle.
- `attributeChangedCallback` fires synchronously on `setAttribute`, so
  no wait is needed after writing an attribute.
- With no native sheet the click handler never awaits, so the list opens
  synchronously. With a stubbed sheet, or any copy, `await flush()`.

## Testing the dismissed sheet (§7.14)

The single most important test in the file, and the easiest to get
wrong:

```ts
const nat = stubNativeShare("reject");
const el = mount({ label: "Share", url: URL_UNDER_TEST });
el.onNativeShare = onNativeShare;
await flush();
click(trigger());
await flush();
expect(nat.calls.length).toBe(1);              // it was attempted
expect(list().hasAttribute("hidden")).toBe(true); // and did NOT fall through
expect(onNativeShare).not.toHaveBeenCalled();  // a dismissal is not a success
```

## Testing focus-out (§7.19)

Focus has to **actually move**, because the handler defers and re-reads
`document.activeElement`. A `focusout` event alone proves nothing:

```ts
outside.focus();                                  // required
from.dispatchEvent(new FocusEvent("focusout", { bubbles: true, relatedTarget: outside }));
```

The suite asserts both directions — leaving closes, moving within does
not.

## Testing the `#render` / `#syncState` split

Assert that a non-structural change preserves the *identity* of the
focused node, not merely that something is focused:

```ts
click(trigger());
const before = items()[0];
el.url = "https://example.test/other";
await flush();
expect(document.activeElement).toBe(before);   // same node, still focused
expect(items()[0]).toBe(before);               // not a rebuilt replacement
expect(list().hasAttribute("hidden")).toBe(false);
```

And that a structural change closes rather than orphaning focus.

## Testing `renderButtonContent()` (§7.22)

Subclass, register once guarded, then assert **both halves**: the custom
node replaced the glyph, *and* the base class's aria wiring survived.

```ts
class CustomShareButton extends ShareButton {
    renderButtonContent(): Node { /* reads this.open, this.currentUrl() */ }
}
if (!customElements.get("custom-share-button")) {
    customElements.define("custom-share-button", CustomShareButton);
}
```

A second test clicks to open and re-reads `data-open`, proving the hook
re-runs on state sync — the property that makes it behave like the
reactive `children` snippet elsewhere.

## Asserting ids

Compare against `items()[i].id` or `trigger().getAttribute("aria-controls")`
rather than hardcoding. Ids come from a module-level counter that
increments across the whole suite run, so exact values depend on how
many elements earlier tests mounted.

## Beyond §7

The last `describe` block covers the catalog idiom rather than the
cross-framework contract: attribute/property mirroring, `targets` being
property-only and returning a defensive copy, the `share-title` rename
coexisting with a real `title` tooltip, the `class` attribute landing on
the rendered root, `openList` no-oping with nothing to show, the absence
of any `localStorage` / document-root writes, listener cleanup on
disconnect, and SSR import safety.

## Mutation checks

The suite has been mutation-checked. Each of these was applied to
`share-button.ts` and confirmed to fail:

| Mutation | Caught by |
| -------- | --------- |
| Arrows wrap instead of clamping | §7.16 |
| Drop `rel="noopener noreferrer"` | §7.3 (both cases) |
| Dismissed sheet returns `false` (falls through to the list) | §7.14 |
| `url` change calls `#render()` instead of `#syncState()` | the split test |
| `copyLabel` defaults to `"Copy link"` | §7.5 |
| Destinations get `role="menuitem"` | §7.3 |

Re-run these after any refactor of the render split or the keyboard
handling.
