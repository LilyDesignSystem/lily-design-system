# Lifecycle — `<theme-chooser>` (HTML helper)

The custom-element-flavoured walk-through of the select's
lifecycle. The canonical contract is in [`../spec/index.md`](../spec/index.md)
§5; this file maps the Svelte canonical's `$effect` lifecycle to
the custom-element callbacks (`connectedCallback`,
`attributeChangedCallback`, `disconnectedCallback`).

## Lifecycle diagram

```
parser sees <theme-chooser label="…" themes-url="…" themes="…">
  │
  ▼
element constructor (no-op — DOM access is forbidden in the
  │                  constructor by the custom-element spec)
  ▼
attributes attached
  │
  ▼  (one attributeChangedCallback per observed attribute)
attributeChangedCallback("label" | "themes" | "themes-url" | …, null, "…")
  ↳ this.#themes = parseCsv(value)
  ↳ #render() — only if isConnected
  │
  ▼
appendChild puts the element in the document
  │
  ▼
connectedCallback:
  ↳ pull initial #themes / #themeLabels from attributes if not set
  ↳ resolve initial value:
       el.value > localStorage[storageKey] > defaultValue > "light" > themes[0]
  ↳ if resolved !== current attribute: setAttribute("value", resolved)
       (this re-enters attributeChangedCallback, but is guarded)
  ↳ #render()  — builds <div> root + hidden input + button + <ul>
  ↳ document.addEventListener("click", #onDocumentClick)
  ↳ if value is non-empty: #applyTheme(value)

user opens the list (button click, ArrowDown / ArrowUp / Enter / Space)
  │
  ▼
openList(startIndex?):
  ↳ #activeIndex = startIndex ?? indexOf(value) ?? 0
  ↳ #open = true
  ↳ #syncState() — aria-expanded, unhide list, aria-activedescendant
  ↳ list.focus()  (focus sits on the <ul>, not on an <li>)

user chooses an option (click, or Enter / Space on the list)
  │
  ▼
#choose(index) → this.value = slug → closeList() → button.focus()
  │
  ▼
attributeChangedCallback("value", oldValue, newValue):
  ↳ #syncState() — NOT #render(); a rebuild would destroy focus
                   and the active descendant
  ↳ #applyTheme(newValue) — only if isConnected

#applyTheme(slug):
  1. getManagedLink().href = themeHref(themesUrl, slug, extension)
  2. (target ?? <html>).setAttribute("data-theme", slug)
  3. if storageKey: localStorage.setItem(storageKey, slug)
  4. dispatchEvent(new CustomEvent("themechange", { detail: { theme: slug }, bubbles: true, composed: true }))

element removed from document
  │
  ▼
disconnectedCallback:
  ↳ document.removeEventListener("click", #onDocumentClick)
  ↳ clearTimeout(#typeaheadTimer)
  ↳ if no other <theme-chooser name="{this.name}"> remains:
       document.head.querySelector('[data-lily-theme-chooser="{name}"]')?.remove()
```

## Two update paths: `#render()` vs `#syncState()`

This is the load-bearing distinction in the lifecycle.

`#render()` **rebuilds** the children: a fresh `<div>` root, hidden
input, button (whose content comes from `renderButtonContent()`),
`<ul>`, and one `<li>` per theme, installed with
`replaceChildren`. It runs for the markup-affecting attributes —
`themes`, `theme-labels`, `label`, `name`, `class` — and it always
closes the list first (`#open = false`, `#activeIndex = -1`),
because a rebuild cannot preserve focus inside the list.

`#syncState()` **mutates in place**: `aria-expanded` on the button;
`hidden` and `aria-activedescendant` on the list; `aria-selected`
and `data-active` per option; and the hidden input's `value`. It
runs on every open, close, active-option move, and `value` change.

A `value` change therefore deliberately does *not* re-render. If it
did, changing the theme while the list is open would destroy the
`<ul>` that currently has focus.

## Listbox close triggers

Three paths close the list, and they differ in whether focus
returns to the button:

| Trigger                        | Call                | Refocus button |
| ------------------------------ | ------------------- | -------------- |
| Option chosen (click / Enter / Space) | `closeList()` | yes            |
| `Escape`                       | `closeList()`       | yes            |
| `Tab`                          | `closeList(false)`  | no — focus moves on |
| Click outside the root         | `closeList(false)`  | no             |
| Focus leaves the root          | `closeList(false)`  | no             |
| Structural re-render           | (state reset)       | no             |

The focus-out handler defers its check to a microtask: some engines
(and jsdom) dispatch `focusout` with a null `relatedTarget` before
the new focus target is committed, so it re-reads
`document.activeElement` before deciding to close.

## Why `connectedCallback` and not the constructor

The custom-element spec forbids DOM mutation in the constructor —
the element might be created by `document.createElement` without
yet having a parent, and its attributes might not have been set
yet. The constructor runs once, before attributes are attached.
`connectedCallback` runs after attributes are attached and the
element is in a document tree, so it is the canonical place to:

- Read attributes.
- Resolve the initial value.
- Render children.
- Mutate `document.head`.

## Why two `#render()` calls

`attributeChangedCallback` fires once per observed attribute when
the element is first parsed; each call enqueues a render. The
first few calls render against partially-populated state (e.g.
`themes` has been parsed but `label` hasn't). When
`connectedCallback` finally runs, it re-resolves the initial value
and re-renders against the now-complete state.

This double-render is harmless because `#render()` is idempotent —
it computes the new children and calls `replaceChildren`, which
replaces the lot atomically.

## Initial-value resolution

Inside `connectedCallback`:

```ts
#resolveInitialValue(): void {
    let initial = this.value;

    if (!initial && this.storageKey) {
        try {
            initial = localStorage.getItem(this.storageKey) ?? "";
        } catch {
            // ignore private-mode / quota errors
        }
    }

    if (!initial) {
        initial =
            this.defaultValue ||
            (this.#themes.includes("light") ? "light" : this.#themes[0]) ||
            "";
    }

    if (initial && initial !== this.value) {
        this.setAttribute("value", initial);
        // attributeChangedCallback fires synchronously and renders.
    }
}
```

`setAttribute` writes the resolved value back to the DOM so it's
inspectable via `el.getAttribute("value")` afterwards. The
re-entrant `attributeChangedCallback` is idempotent.

## Apply

```ts
#applyTheme(slug: string): void {
    if (typeof document === "undefined" || !slug) return;
    this.#getManagedLink().href = themeHref(this.themesUrl, slug, this.extension);
    (this.#target ?? document.documentElement).setAttribute("data-theme", slug);
    if (this.storageKey) {
        try { localStorage.setItem(this.storageKey, slug); } catch { /* ignore */ }
    }
    this.dispatchEvent(
        new CustomEvent<ThemeChooserChangeDetail>("themechange", {
            detail: { theme: slug },
            bubbles: true,
            composed: true,
        }),
    );
}
```

The `typeof document === "undefined"` guard makes the function
no-op safely if ever called outside the browser; in practice
custom elements only register in browsers.

## Reactivity

Only the `value` attribute triggers a re-apply. Other observed
attributes trigger a re-render (when relevant — `themes`,
`theme-labels`, `label`, `name`, `class`) but do not re-apply the
theme. The next user-driven change applies with the updated
attributes. `themes-url`, `default-value`, `storage-key`, and
`extension` neither render nor apply; they affect the next apply.

If a consumer wants to re-apply when, e.g., `themes-url` changes
mid-session, they can write back to `value`:

```ts
const select = document.querySelector("theme-chooser")!;
const current = select.getAttribute("value");
select.setAttribute("themes-url", "/assets/themes-v2/");
select.removeAttribute("value");
if (current) select.setAttribute("value", current); // forces re-apply
```

## SSR

The class definition file (`theme-chooser.ts`) has no top-level DOM
access. The barrel (`index.ts`) only calls
`customElements.define(...)` when `typeof customElements !==
"undefined"`, so importing the module in Node throws no error.

`connectedCallback` only fires when the element is in a document
tree, which never happens in Node.

The static-site-generator recipe for flicker-free first paint is:
inline `<html data-theme="…">` and the matching `<link>` in the
SSG-emitted HTML, plus pass the resolved `value` attribute on the
`<theme-chooser>` host. The select upgrades without changing
anything visible. See [`./ssr.md`](./ssr.md).

## Unmount

`disconnectedCallback` removes the managed `<link>` only when no
other `<theme-chooser>` with the same `name` remains in the
document. This lets multiple selects coordinate (paired UI) while
still cleaning up when both unmount.

If a consumer wants to fully tear down the theme on unmount, they
can do it themselves before removing the element:

```ts
document.head.querySelector('[data-lily-theme-chooser="theme"]')?.remove();
document.documentElement.removeAttribute("data-theme");
document.querySelector("theme-chooser")?.remove();
```

This is rare. Most apps want the theme to outlive the select.

## Re-attaching the element

If a consumer removes the select and re-attaches it later (e.g.
inside a tab panel that mounts on demand), the lifecycle restarts:

- `disconnectedCallback` fires on removal.
- `connectedCallback` fires on re-insertion.
- The managed `<link>` is re-created (the old one was removed in
  `disconnectedCallback`).
- The initial value resolves from the current `value` attribute or
  `localStorage[storageKey]`, so the select self-restores.

This matches the contract of the platform — every other native
element behaves the same way on detach/re-attach.
