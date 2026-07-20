# Lifecycle — LocaleSelect (Angular)

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
  ▼
effect run 1 (initialised=false):
  resolve initial value (value > storage > navigator > defaultValue > "en" > locales[0])
    │
    ├── if resolved !== current: this.value.set(resolved); set initialised=true; return
    │
    └── otherwise: set initialised=true; if current is truthy, applyLocale(current)

effect run 2 (triggered by value.set(resolved)):
  initialised=true, applyLocale(current)
    1. (target() ?? <html>).setAttribute("lang", bcp47LocaleTag(code))
    2. if applyDir: (target() ?? <html>).setAttribute("dir", isRtl(code) ? "rtl" : "ltr")
    3. if storageKey: localStorage.setItem(storageKey, code)
    4. localeChange.emit(code) — consumer-form, not BCP 47 normalised

user picks an option (click, or Enter / Space on the active option)
  │
  ▼
choose(index)
  this.value.set(locales()[index])
  closeList()  →  open=false, activeIndex=-1, focus back to the button
    │
    ▼
  effect re-runs because value() changed
    applyLocale(next)
```

## The open / close state machine

Independent of the value lifecycle above, and holding no effects of
its own:

```
closed  ── click button ─────────────► open, active = selected (or 0)
        ── ArrowDown / Enter / Space ► open, active = selected (or 0)
        ── ArrowUp ──────────────────► open, active = last
                                        │
                                        ▼
                            focus moves to the <ul> (queueMicrotask)
                            active option scrolled into view

open    ── ArrowDown / ArrowUp ──────► move active, clamped at both ends
        ── Home / End ───────────────► active = first / last
        ── printable char ───────────► typeahead over labels (500 ms buffer)
        ── Enter / Space ────────────► choose(active) → value change + close + refocus
        ── click an option ──────────► choose(i)      → value change + close + refocus
        ── Escape ───────────────────► close + refocus, value unchanged
        ── Tab ──────────────────────► close, focus NOT pulled back
        ── click outside root ───────► close, focus NOT pulled back
        ── focusout leaves root ─────► close, focus NOT pulled back
```

`closeList(refocus = true)` is the single exit; the three
"focus NOT pulled back" paths pass `refocus = false` so the browser
(or the user's click) keeps control of where focus lands.

## Why `effect()` and not `ngOnInit` + `ngOnChanges`

`effect()` is the only reactive primitive Angular needs for this
lifecycle:

- **It re-runs automatically** on every signal change it reads.
- **It runs on the browser tick.** During SSR, the scheduler
  doesn't fire, so the document guard inside the callback is
  enough.
- **It composes with `model()` round-trips.** When `value.set(...)`
  fires inside the effect, the effect re-runs cleanly on the next
  tick.

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

            if (
                !initial &&
                this.detectFromNavigator() &&
                typeof navigator !== "undefined"
            ) {
                const navLangs =
                    navigator.languages && navigator.languages.length > 0
                        ? Array.from(navigator.languages)
                        : navigator.language
                            ? [navigator.language]
                            : [];
                initial = matchNavigatorLanguage(navLangs, this.locales());
            }

            if (!initial) {
                const locales = this.locales();
                const dv = this.defaultValue();
                initial =
                    dv ||
                    (locales.includes("en") ? "en" : locales[0]) ||
                    "";
            }

            if (initial && initial !== current) {
                this.value.set(initial);
                return;
            }
        }

        if (current) this.applyLocale(current);
    });
}
```

Resolving and writing back via `this.value.set(initial)` triggers
the effect to fire again on the next microtask. The
`private initialised = false` flag guards subsequent runs from
re-running the whole resolution.

## Apply

```ts
private applyLocale(code: string): void {
    if (typeof document === "undefined" || !code) return;
    const root = this.target() ?? document.documentElement;
    root.setAttribute("lang", bcp47LocaleTag(code));
    if (this.applyDir()) {
        root.setAttribute("dir", isRtlLocale(code) ? "rtl" : "ltr");
    }
    const sk = this.storageKey();
    if (sk) {
        try {
            localStorage.setItem(sk, code);
        } catch {
            // ignore quota / privacy errors
        }
    }
    this.localeChange.emit(code);
}
```

The `typeof document === "undefined"` guard makes the function
no-op safely if ever called during SSR; in practice the effect's
scheduler doesn't tick server-side.

## Why `localeChange` emits the consumer form, not BCP 47

The `lang` attribute on the DOM is normalised to BCP 47 hyphen
form, but the `localeChange` event payload (and the bindable
`value`) preserves the consumer's original form (`en_US` if the
consumer put `en_US` in `locales`). This keeps round-trips
lossless and lets the consumer's i18n library — which might use
the underscore form internally — receive the same string it
stored.

## Reactivity

The single `effect()` reads `this.value()`. Other inputs
(`storageKey`, `detectFromNavigator`, `defaultValue`, `target`,
`applyDir`, `name`, `localeLabels`, `className`) are read inside
the apply function on every fire, so their changes take effect on
the next value change — not retroactively.

If a consumer wants to re-apply when `target` changes mid-session,
they can write back to `value`:

```ts
import { Component, effect, signal } from "@angular/core";

@Component({ /* … */ })
export class Settings {
    locale = signal("en");
    target = signal<HTMLElement | null>(null);

    constructor() {
        effect(() => {
            this.target();          // track
            const current = this.locale();
            this.locale.set("");
            this.locale.set(current); // forces re-apply
        });
    }
}
```

## SSR

During server rendering, the `effect()` callback may run but the
`typeof document` guard prevents DOM mutation. The template renders
the button and the closed (`hidden`) listbox; `lang` and `dir`
attributes are not written to `<html>` server-side. Per-instance ids
come from the `nextLocaleSelectId()` module counter rather than
`Math.random()` / `Date.now()`, so the server and client agree on
`aria-controls`, the list `id`, and every option `id`.

That's the recipe for flicker-free SSR: pre-resolve the locale on
the server, bridge it via an injection token, and use it as the
`value` input. See [`./ssr.md`](./ssr.md).

## Destroy

`inject(DestroyRef).onDestroy(…)` clears the pending typeahead
timer. Nothing else needs unwinding: the outside-click listener is a
`host: { "(document:click)": … }` binding and the focus-out listener
is a `(focusout)` template binding, so Angular removes both.

The component does not clean up `lang` / `dir` on destroy. That's
intentional: the select may be destroyed because the consumer
navigated away from a settings page; the locale should stay
applied.

If a consumer wants to fully reset, they can do it via
`DestroyRef.onDestroy(...)`.

## Watch graph

| Signal                  | Read where                         | Effect on change                          |
| ----------------------- | ---------------------------------- | ----------------------------------------- |
| `value()`               | top of the effect                  | re-runs the whole effect                  |
| `locales()`             | initial-value resolution           | only affects the first run                |
| `storageKey()`          | initial-value resolution + apply   | next value change re-reads / re-writes    |
| `defaultValue()`        | initial-value resolution           | only affects the first run                |
| `detectFromNavigator()` | initial-value resolution           | only affects the first run                |
| `applyDir()`            | apply                              | next value change toggles dir write       |
| `target()`              | apply                              | next value change writes lang/dir on the new target |
| `name()`                | template                           | re-renders template                       |
| `localeLabels()`        | template (via `labelFor`)          | re-renders template                       |
| `className()`           | template                           | re-renders template                       |

## Watch vs the navigator-detection helper

`matchNavigatorLanguage` is only called on the first effect run.
The select never re-runs detection mid-session — the user's choice
should win over `navigator.languages` once expressed. If a
consumer wants to re-detect (e.g. on a settings reset), they can
call the exported helper manually and write the result to the
bound `value`.
