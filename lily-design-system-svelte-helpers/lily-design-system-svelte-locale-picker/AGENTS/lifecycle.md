# Lifecycle — LocaleChooser (Svelte)

The Svelte 5 walk-through of the select's lifecycle. The canonical
contract is in [`../spec/index.md`](../spec/index.md) §5; this file expands the
`$effect` body so you can read it without scrolling.

## Lifecycle diagram

```
mount
  │
  ▼
$effect (first run, browser only)
  │
  ▼
initialised? ── no ──► resolve initial value (value > storage > navigator > defaultValue > "en" > locales[0])
  │                       │
  │                       ▼
  │                     if resolved !== current: value = resolved  (bind-back; $effect re-runs)
  │                       │
  │                     else: applyLocale(resolved)
  │
  yes ──► applyLocale(value)

applyLocale:
  1. (target ?? <html>).setAttribute("lang", bcp47LocaleTag(code))
  2. if applyDir: (target ?? <html>).setAttribute("dir", isRtl(code) ? "rtl" : "ltr")
  3. if storageKey: localStorage.setItem(storageKey, code)
  4. onChange?.(code) — consumer-form, not BCP 47 normalised

user picks an option
  │
  ▼
select change ─► value = next
  │                  │
  │                  ▼
  │                $effect re-runs (value changed)
  │                  │
  ▼                  ▼
  (bind:value resolves) applyLocale(next)
```

## Why one `$effect`, not two

Svelte 5's `$effect` runs after every render whose tracked reads
changed. Putting initial-value resolution and apply in **one**
effect keeps the dependency graph small:

- The effect tracks `value` (read at the top).
- On first run, the `initialised` latch handles resolution; on
  subsequent runs, the same effect just applies the new value.
- Other props (`target`, `applyDir`, `localeLabels`, `storageKey`)
  are read **inside** `applyLocale` on demand, so they don't add
  tracked dependencies; changes to them take effect on the next
  `value` change rather than retroactively.

A second effect that watched all props would re-fire whenever the
consumer mutated `localeLabels` for a no-user-visible reason.

## Initial-value resolution

```ts
let initialised = false;

$effect(() => {
    const current = value;

    if (!initialised) {
        initialised = true;
        let initial = current;

        if (!initial && storageKey) {
            try {
                initial = localStorage.getItem(storageKey) ?? "";
            } catch {
                // ignore private-mode / quota errors
            }
        }

        if (!initial && detectFromNavigator && typeof navigator !== "undefined") {
            const navLangs =
                navigator.languages && navigator.languages.length > 0
                    ? Array.from(navigator.languages)
                    : navigator.language
                      ? [navigator.language]
                      : [];
            initial = matchNavigatorLanguage(navLangs, locales);
        }

        if (!initial) {
            initial =
                defaultValue ??
                (locales.includes("en") ? "en" : locales[0]) ??
                "";
        }

        if (initial && initial !== current) {
            value = initial;
            return;  // re-runs after the bind-back
        }
    }

    if (current) applyLocale(current);
});
```

The early `return` after `value = initial` lets the effect rerun
with the new `value` and apply the locale through the normal path,
instead of double-applying.

## Apply

```ts
function applyLocale(code: string): void {
    if (typeof document === "undefined" || !code) return;
    const root = target ?? document.documentElement;
    root.setAttribute("lang", bcp47LocaleTag(code));
    if (applyDir) {
        root.setAttribute("dir", isRtlLocale(code) ? "rtl" : "ltr");
    }
    if (storageKey) {
        try { localStorage.setItem(storageKey, code); } catch { /* ignore */ }
    }
    onChange?.(code);
}
```

The `typeof document === "undefined"` guard makes `applyLocale` a
no-op if it's ever called outside the browser. In practice it
isn't called server-side because `$effect` only runs in the
browser, but the guard is cheap insurance against future refactors.

## Why `onChange` emits the consumer form, not the BCP 47 form

The `lang` attribute on the DOM is normalised to BCP 47 hyphen
form, but the `onChange` payload (and the bindable `value`)
preserves the consumer's original form (`en_US` if the consumer
put `en_US` in `locales`). This keeps round-trips lossless and
lets the consumer's i18n library — which might use the underscore
form internally — receive the same string it stored.

## Reactivity

Only `value` is tracked by `$effect`. Other props are read inside
the apply function on every fire, so changes take effect on the
next value change, not retroactively.

If a consumer wants to re-apply when `target` changes, they can
write back to `value`:

```svelte
<script lang="ts">
    let target = $state<HTMLElement | null>(null);
    let locale = $state("en");

    $effect(() => {
        target;  // track
        const current = locale;
        locale = "";
        locale = current;
    });
</script>
```

## SSR

During server rendering, `$effect` is a no-op. The template renders
the button, the (hidden) listbox, and the `<li>` options using
whatever `value` was passed — which decides `aria-selected` and the
hidden input — while the `lang` and `dir` attributes are not written
to `<html>` (no DOM).

Option ids come from the module-level `nextLocaleChooserId()` counter,
so server and client generate identical ids in the same mount order
and hydration matches.

That's the recipe for flicker-free SSR: pre-resolve the locale on
the server, write `lang="…"` and `dir="…"` on `<html>` via
SvelteKit's `transformPageChunk`, and pass the resolved code as
`value`. See [`./ssr.md`](./ssr.md).

## Unmount

The component does not clean up `lang` / `dir` on unmount. That's
intentional: the select may be unmounted because the consumer
navigated away from a settings page; the locale should stay
applied.

If a consumer wants to fully reset on unmount, they can do it
themselves with `onDestroy`.

## Effect vs navigator-detection helper

`matchNavigatorLanguage` is only called inside the resolution
branch of `$effect`, which only runs once (the `initialised`
latch). The select never re-runs detection mid-session — the
user's choice should win over `navigator.languages` once
expressed. If a consumer wants to re-detect (e.g. on a settings
reset), they can call the exported helper manually and write the
result to the bound `value`.

## Storage error handling

Both reads and writes to `localStorage` are wrapped in try/catch.
Three legitimate failure modes are silently swallowed:

1. Private / incognito mode that refuses storage writes.
2. Quota-exceeded errors (very rare for a single tiny string).
3. `localStorage` being undefined entirely (some embedded WebView
   contexts).

The select degrades to "no persistence" — the user's choice
applies for the session but doesn't survive a reload. That's
acceptable; the alternative would be a thrown error that breaks
the whole component tree.
