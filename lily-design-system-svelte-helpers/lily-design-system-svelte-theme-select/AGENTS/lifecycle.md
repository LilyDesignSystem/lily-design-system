# Lifecycle — ThemeSelect (Svelte)

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
initialised? ── no ──► resolve initial value
  │                     (value > storage > matchSystemTheme (if detectFromSystem)
  │                      > defaultValue > "light" > themes[0])
  │                       │
  │                       ▼
  │                     if resolved !== current: value = resolved  (bind-back; $effect re-runs)
  │                       │
  │                     else: applyTheme(resolved)
  │
  yes ──► applyTheme(value)

applyTheme:
  1. getManagedLink().href = themeHref(themesUrl, slug, extension)
  2. (target ?? <html>).setAttribute("data-theme", slug)
  3. if storageKey: localStorage.setItem(storageKey, slug)
  4. onChange?.(slug)

user picks an option (click, or Enter / Space on the active option)
  │
  ▼
choose(index) ─► setTheme(slug) ─► value = next
  │                                   │
  │                                   ▼
  │                                 $effect re-runs (value changed)
  │                                   │
  ▼                                   ▼
  closeList() → refocus button    applyTheme(next)
```

## Open / close lifecycle

Selection state and open state are deliberately separate. `value` is
the applied theme; `open` and `activeIndex` are transient UI state that
never touch `$effect`.

```
openList(startIndex?)
  activeIndex = startIndex ?? (index of value, else 0)
  open = true
  queueMicrotask: listEl.focus(); scrollActiveIntoView()

closeList(refocus = true)
  if !open: return
  open = false
  activeIndex = -1
  if refocus: queueMicrotask: buttonEl.focus()
```

`closeList(false)` is used where focus is already going somewhere else
— `Tab`, an outside click, or focus leaving the root — so the component
never yanks focus back from where the user sent it.

The `queueMicrotask` wrappers matter: the DOM node must exist (and the
`hidden` attribute must be gone) before focus can land on it.

## Why one `$effect`, not two

Svelte 5's `$effect` runs after every render whose tracked reads
changed. Putting initial-value resolution and apply in **one**
effect keeps the dependency graph small:

- The effect tracks `value` (read at the top).
- On first run, the `initialised` latch handles resolution; on
  subsequent runs, the same effect just applies the new value.
- Other props (`themesUrl`, `extension`, `target`, `name`,
  `themeLabels`, `storageKey`) are read **inside** `applyTheme` on
  demand, so they don't add tracked dependencies; changes to them
  take effect on the next `value` change rather than retroactively.

A second effect that watched all props would re-fetch the
stylesheet whenever the consumer mutated `themeLabels` for a
no-user-visible reason. Don't do that.

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
        if (!initial && detectFromSystem) {
            initial = matchSystemTheme(themes);
        }
        if (!initial) {
            initial =
                defaultValue ??
                (themes.includes("light") ? "light" : themes[0]) ??
                "";
        }
        if (initial && initial !== current) {
            value = initial;
            return;  // re-runs after the bind-back
        }
    }

    if (current) applyTheme(current);
});
```

The early `return` after `value = initial` is important: it lets the
effect rerun with the new `value` and apply the theme through the
normal path, instead of double-applying.

`matchSystemTheme` sits below storage on purpose: a user who explicitly
picked a theme keeps it when they later flip their OS setting. It slots
into exactly the position `matchNavigatorLanguage` occupies in
`locale-select`, which is what makes the two helpers' resolution orders
readable side by side. It returns `""` — never throws — when
`matchMedia` is unavailable, so SSR and jsdom fall through cleanly to
the next step.

## Apply

```ts
function applyTheme(slug: string): void {
    if (typeof document === "undefined" || !slug) return;
    getManagedLink().href = themeHref(themesUrl, slug, extension);
    (target ?? document.documentElement).setAttribute("data-theme", slug);
    if (storageKey) {
        try { localStorage.setItem(storageKey, slug); } catch { /* ignore */ }
    }
    onChange?.(slug);
}
```

The `typeof document === "undefined"` guard makes `applyTheme` a
no-op if it's ever called outside the browser. In practice it
isn't called server-side because `$effect` only runs in the browser,
but the guard is cheap insurance against future refactors.

## The managed `<link>`

```ts
function getManagedLink(): HTMLLinkElement {
    const selector = `link[data-lily-theme-select="${name}"]`;
    let link = document.head.querySelector<HTMLLinkElement>(selector);
    if (!link) {
        link = document.createElement("link");
        link.rel = "stylesheet";
        link.setAttribute("data-lily-theme-select", name);
        document.head.appendChild(link);
    }
    return link;
}
```

One `<link>` per select `name`. Switching themes only mutates
`href`. Two selects with different `name`s coexist (e.g. a quick
toggle in the header and a full select in settings); two selects
with the same `name` share the same managed `<link>` and will
fight if their `value`s diverge — so don't do that.

## Reactivity

Only `value` is tracked by `$effect`. Other props are read inside
the apply function on every fire, so changes take effect on the
next value change, not retroactively. This matches the contract in
`spec/index.md §5.4`.

If a consumer wants to re-apply when `themesUrl` changes
mid-session, they can write back to `value`:

```svelte
<script lang="ts">
    let themesUrl = $state("/assets/themes/");
    let theme = $state("light");

    $effect(() => {
        themesUrl;  // track
        const current = theme;
        theme = "";
        theme = current;
    });
</script>
```

This forces the select's `$effect` to fire.

## SSR

During server rendering, `$effect` is a no-op. The template renders
the button, the listbox, and the `<li>` options using whatever `value`
was passed (which decides `aria-selected` and the hidden input); the managed
`<link>` is not created (no DOM); `data-theme` is not written.

That's the recipe for flicker-free SSR: pre-resolve the theme on
the server, write `data-theme="…"` on `<html>` via SvelteKit's
`transformPageChunk`, and pass the resolved slug as `value`. See
[`./ssr.md`](./ssr.md).

## Unmount

The component does not clean up the managed `<link>` or the
`data-theme` attribute on unmount. That's intentional:

- The select may be unmounted because the consumer navigated away
  from the settings page; the theme should stay applied.
- The next select mount reuses the same managed `<link>` (located
  by `data-lily-theme-select="{name}"`).

If a consumer wants to fully tear down the theme on unmount, they
can do it themselves:

```svelte
<script lang="ts">
    import { onDestroy } from "svelte";

    onDestroy(() => {
        document.head.querySelector('[data-lily-theme-select="theme"]')?.remove();
        document.documentElement.removeAttribute("data-theme");
    });
</script>
```

This is rare. Most apps want the theme to outlive the select.
