# Lifecycle — ThemeChooser (Angular)

The Angular-flavoured walk-through of the select's lifecycle. The
canonical contract is in [`../spec/index.md`](../spec/index.md) §5; this file
maps the Svelte canonical's `$effect` lifecycle to Angular's
`effect()`.

## Lifecycle diagram

```
component construction
  │
  ▼
constructor — registers one `effect(() => …)` that reads `value()`
  │
  │ (first signal read in browser tick schedules the effect)
  │
  ▼
effect run 1 (initialised=false):
  resolve initial value
  (value > storage > detectFromSystem > defaultValue > "light" > themes[0])
    │
    ├── if resolved !== current: this.value.set(resolved); set initialised=true; return
    │
    └── otherwise: set initialised=true; if current is truthy, applyTheme(current)

effect run 2 (triggered by value.set(resolved)):
  initialised=true, applyTheme(current)
    1. getManagedLink().href = themeHref(themesUrl, slug, extension)
    2. (target() ?? <html>).setAttribute("data-theme", slug)
    3. if storageKey: localStorage.setItem(storageKey, slug)
    4. themeChange.emit(slug)

user picks an option (click on the <li>, or Enter / Space on the
active option in the open listbox)
  │
  ▼
choose(index)
  this.value.set(themes()[index])
  closeList()  →  open=false, activeIndex=-1, focus back to the button
    │
    ▼
  effect re-runs because value() changed
    applyTheme(next)
```

## The open/close lifecycle

Separate from — and orthogonal to — the theme-application effect
above. Open state is two plain signals (`open`, `activeIndex`), not
part of the `effect()` graph:

```
button click / ArrowDown / Enter / Space   →  openList()
button ArrowUp                             →  openList(themes().length - 1)
    activeIndex = startIndex ?? (selected index, else 0)
    open = true
    queueMicrotask: listEl.focus(); scrollActiveIntoView()

listbox ArrowDown/ArrowUp                  →  moveActive(±1), clamped
listbox Home / End                         →  activeIndex = 0 / last
listbox printable char                     →  runTypeahead(char), 500 ms buffer
listbox Enter / Space                      →  choose(activeIndex)
listbox Escape                             →  closeList()        (refocus button)
listbox Tab                                →  closeList(false)   (leave focus alone)
root focusout to outside                   →  closeList(false)
document click outside the root            →  closeList(false)
```

`closeList(refocus = true)` returns early if already closed, clears
`activeIndex` to `-1`, and — when `refocus` is true — moves focus
back to the button in a `queueMicrotask`. The microtask matters:
Angular has to re-render the `hidden` attribute before the browser
will accept focus on the button.

`queueMicrotask` is also why the open path focuses the `<ul>`
asynchronously — the element is `hidden` at the moment `open.set(true)`
runs, and a hidden element cannot take focus.

The typeahead timer is the only resource needing teardown; it is
cleared through `inject(DestroyRef).onDestroy(...)`.

## Why `effect()` and not `ngOnInit` + `ngOnChanges`

`effect()` is the only reactive primitive Angular needs for this
lifecycle:

- **It re-runs automatically** on every signal change it reads.
  No `ngOnChanges` plumbing required.
- **It runs on the browser tick.** During SSR, the scheduler doesn't
  fire, so the document guard inside the callback is enough.
- **It composes with `model()` round-trips.** When `value.set(...)`
  fires inside the effect, the effect re-runs cleanly on the next
  tick (Angular detects the recursive write and schedules a
  microtask).

The legacy `ngOnInit` + `ngOnChanges` combination is twice the code
and doesn't compose with `model()` writes naturally — the writes
fire input-change events that have to be filtered to avoid loops.

## Initial-value resolution

Inside the effect's first run:

```ts
constructor() {
    effect(() => {
        const current = this.value();

        if (!this.initialised) {
            this.initialised = true;
            let initial = current;

            const sk = this.storageKey();
            if (!initial && sk) {
                try {
                    initial = (typeof localStorage !== "undefined"
                        ? localStorage.getItem(sk)
                        : null) ?? "";
                } catch {
                    // ignore privacy errors
                }
            }

            if (!initial) {
                const themes = this.themes();
                const dv = this.defaultValue();
                initial =
                    dv ||
                    (themes.includes("light") ? "light" : themes[0]) ||
                    "";
            }

            if (initial && initial !== current) {
                this.value.set(initial);
                return;
            }
        }

        if (current) this.applyTheme(current);
    });
}
```

Resolving and writing back via `this.value.set(initial)` triggers
the effect to fire again on the next microtask; the dual-path makes
initial mount idempotent whether or not a non-empty `value` was
supplied.

The `private initialised = false` flag guards the resolution from
re-running on subsequent value changes. After the first run, every
subsequent effect tick goes straight to `applyTheme(current)`.

## Apply

```ts
private applyTheme(slug: string): void {
    if (typeof document === "undefined" || !slug) return;
    const link = this.getManagedLink();
    if (link) link.href = themeHref(this.themesUrl(), slug, this.extension());
    (this.target() ?? document.documentElement).setAttribute("data-theme", slug);

    const sk = this.storageKey();
    if (sk) {
        try {
            localStorage.setItem(sk, slug);
        } catch {
            // ignore quota / privacy errors
        }
    }
    this.themeChange.emit(slug);
}
```

The `typeof document === "undefined"` guard makes the function
no-op safely if ever called during SSR; in practice the effect's
scheduler doesn't tick server-side.

## Managed `<link>`

```ts
private getManagedLink(): HTMLLinkElement | null {
    if (typeof document === "undefined") return null;
    const selector = `link[data-lily-theme-chooser="${this.name()}"]`;
    let link = document.head.querySelector<HTMLLinkElement>(selector);
    if (!link) {
        link = document.createElement("link");
        link.rel = "stylesheet";
        link.setAttribute("data-lily-theme-chooser", this.name());
        document.head.appendChild(link);
    }
    return link;
}
```

One `<link>` per select `name`. The `name()` signal is read on
every apply (not cached) so consumers who change `name` mid-session
get a new managed link automatically.

## Reactivity

The single `effect()` reads `this.value()`. Other inputs
(`themesUrl`, `extension`, `target`, `name`, `themeLabels`,
`storageKey`, `themes`) are read inside the apply function on every
fire, so their changes take effect on the next value change — not
retroactively.

If a consumer wants to re-apply when, e.g., `themesUrl` changes
mid-session, they can write back to `value`:

```ts
@Component({
    template: `
        <lily-theme-chooser
            [themesUrl]="themesUrl()"
            [themes]="themes"
            [(value)]="theme"
            label="Theme"
        />
    `,
})
export class Settings {
    themes = ["light", "dark"];
    theme = signal("");
    themesUrl = signal("/assets/themes/");

    onUrlChange(next: string) {
        this.themesUrl.set(next);
        const current = this.theme();
        this.theme.set("");
        this.theme.set(current);  // forces the effect to fire
    }
}
```

## SSR

During server rendering, the `effect()` callback may run but the
`typeof document` guard prevents DOM mutation. The template renders
the root `<div>`, the hidden input, the button, and the closed
(`hidden`) listbox using whatever `value` was passed; the managed
`<link>` is not created (no DOM); `data-theme` is not written. Ids
come from the `nextThemeChooserId()` counter, so they match between
the server and client renders and hydration does not complain.

That's the recipe for flicker-free SSR: pre-resolve the theme on
the server (cookie / header), bridge it via an injection token,
and use it as the `value` input. See
[`./ssr.md`](./ssr.md).

## Destroy

`inject(DestroyRef).onDestroy(...)` clears the pending typeahead
timer. The `(document:click)` host binding and the `(focusout)`
binding are Angular-managed, so they unregister with the view; there
is no manual `removeEventListener` to get wrong.

The component does **not** clean up the managed `<link>` or the
`data-theme` attribute on destroy. That's intentional:

- The select may be destroyed because the consumer navigated away
  from the settings page; the theme should stay applied.
- The next select mount reuses the same managed `<link>` (located
  by `data-lily-theme-chooser="{name}"`).

If a consumer wants to fully tear down the theme on destroy, they
can do it via `DestroyRef`:

```ts
import { Component, DestroyRef, inject } from "@angular/core";

@Component({ /* … */ })
export class Settings {
    private destroyRef = inject(DestroyRef);

    constructor() {
        this.destroyRef.onDestroy(() => {
            document.head
                .querySelector('[data-lily-theme-chooser="theme"]')
                ?.remove();
            document.documentElement.removeAttribute("data-theme");
        });
    }
}
```

This is rare. Most apps want the theme to outlive the select.

## Watch graph

| Signal           | Read where                       | Effect on change                                   |
| ---------------- | -------------------------------- | -------------------------------------------------- |
| `value()`        | top of the effect                | re-runs the whole effect                           |
| `themes()`       | initial-value resolution         | only affects the first run                         |
| `storageKey()`   | initial-value resolution + apply | next value change re-reads / re-writes             |
| `defaultValue()` | initial-value resolution         | only affects the first run                         |
| `themesUrl()`    | apply                            | next value change rewrites the `<link>` href       |
| `extension()`    | apply                            | next value change rewrites the `<link>` href       |
| `target()`       | apply                            | next value change writes `data-theme` on the new target |
| `name()`         | apply                            | next value change creates / locates a new managed link |
| `themeLabels()`  | template (via `labelFor`)        | re-renders template; also changes typeahead matching |
| `className()`    | template                         | re-renders template                                |
| `open()`         | template + `activeDescendant()`  | shows / hides the listbox, flips `aria-expanded`   |
| `activeIndex()`  | template + `activeDescendant()`  | moves `data-active` and `aria-activedescendant`    |

The minimal effect signature (only `value()` re-runs it) keeps the
work bounded — no unnecessary stylesheet loads when peripheral
inputs change. `open()` and `activeIndex()` are deliberately *outside*
that effect: opening a listbox must never re-fetch a stylesheet.
