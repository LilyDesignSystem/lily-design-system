# Lifecycle — ThemeChooser (Vue)

The Vue-flavoured walk-through of the chooser's lifecycle. The
canonical contract is in [`../spec/index.md`](../spec/index.md) §5; this file
maps the Svelte canonical's `$effect` lifecycle to Vue's
`onMounted` + `watch`.

Two lifecycles run side by side and should not be confused:

- The **apply lifecycle** below — value resolution, the `<link>` swap,
  `data-theme`, persistence. Unchanged by the icon-button rewrite.
- The **open/close lifecycle** — `open`, `activeIndex`, focus movement,
  typeahead. Purely presentational; it commits into the apply lifecycle
  at exactly one point, `choose()`.

## Lifecycle diagram

```
mount
  │
  ▼
onMounted ─► addEventListener("click", onDocumentClick)   ← outside-click close
  │
  ├─► resolve initial value (current > storage > defaultValue > "light" > themes[0])
  │             │
  │             ▼
  │           if resolved !== current: current = resolved; emit("update:value", resolved)
  │             │      → watch on `current` fires → applyTheme(resolved)
  │             │
  │           else: applyTheme(resolved)
  ▼
applyTheme:
  1. getManagedLink().href = themeHref(themesUrl, slug, extension)
  2. (target ?? <html>).setAttribute("data-theme", slug)
  3. if storageKey: localStorage.setItem(storageKey, slug)
  4. emit("change", slug)

user commits an option (click, or Enter / Space on the listbox)
  │
  ▼
choose(index) ─► setTheme(slug) ─► current = slug; emit("update:value", slug)
  │                                   │
  │                                   ▼
  │                                 watch on `current` fires → applyTheme(slug)
  ▼
closeList() ─► open = false; activeIndex = -1; await nextTick(); button.focus()

onBeforeUnmount ─► removeEventListener("click", …); clearTimeout(typeaheadTimer)
```

Note what is *not* in that diagram: opening the listbox, arrowing
around, `Home` / `End`, and typeahead all move `activeIndex` only. No
theme is applied until `choose()` runs, which is why `Escape` can close
without changing anything.

## Internal `current`, not `props.value`

The component keeps an internal `current` ref as its source of truth
and mirrors `props.value` into it:

```ts
const current = ref(props.value ?? "");

watch(
    () => props.value,
    (next) => {
        if (next !== undefined && next !== current.value) current.value = next;
    },
);

watch(current, (next, prev) => {
    if (next && next !== prev) applyTheme(next);
});
```

This is what lets the component work both **controlled** (the consumer
drives `v-model:value`) and **uncontrolled** (no binding at all — the
component resolves and applies a default itself). Watching
`props.value` alone would break the uncontrolled case, because nothing
would ever write it back.

## Why `onMounted` + `watch`, not `watchEffect`

`watchEffect` would auto-track every prop it reads. We don't want
the chooser to re-apply when `themesUrl` or `extension` changes
without a corresponding value change — that would re-fetch the
stylesheet for no user-visible reason. Explicit `watch` calls keep the
dependency graph small and predictable.

## Initial-value resolution

Inside `onMounted`:

```ts
onMounted(() => {
    document.addEventListener("click", onDocumentClick);

    let initial = current.value;
    if (!initial && props.storageKey) {
        try {
            initial = localStorage.getItem(props.storageKey) ?? "";
        } catch {
            // ignore privacy errors
        }
    }
    if (!initial) {
        initial =
            props.defaultValue ??
            (props.themes.includes("light") ? "light" : props.themes[0]) ??
            "";
    }
    if (initial && initial !== current.value) {
        current.value = initial;
        emit("update:value", initial);
        return;
    }
    if (initial) applyTheme(initial);
});
```

Writing `current` triggers the `watch` to apply the theme; the
dual-path makes initial mount idempotent whether or not a non-empty
`value` was supplied.

## Open / close and focus

`openList(startIndex?)` sets `activeIndex` (to `startIndex`, else the
selected option's index, else 0), flips `open`, then `await nextTick()`
before focusing the `<ul>`. The `await` is load-bearing: while
`open` is false the list carries `hidden`, and a hidden element cannot
take focus — focusing before the DOM flush silently does nothing.

`closeList(refocus = true)` clears `open` and `activeIndex`, then
`await nextTick()` before refocusing the button. `refocus` is `false`
for the two cases where the user is already moving focus themselves —
`Tab`, and focus/click leaving the root — so the component never yanks
focus back.

`scrollActiveIntoView()` looks the option up with
`document.getElementById` rather than a selector (ids need no CSS
escaping that way, and `CSS.escape` is missing in some jsdom versions)
and calls `scrollIntoView?.()` optionally, because jsdom does not
implement it.

## Typeahead

`runTypeahead(char)` appends to a module-scoped buffer, resets it with
a 500 ms `setTimeout`, and searches forward from the active option,
wrapping once, matching `labelFor(slug)` case-insensitively. The timer
is cleared in `onBeforeUnmount` alongside the document click listener.

Note the asymmetry with arrow keys: typeahead **wraps**, arrow keys
**clamp**. Both follow the APG.

## Apply

```ts
function applyTheme(slug: string): void {
    if (typeof document === "undefined" || !slug) return;
    getManagedLink().href = themeHref(props.themesUrl, slug, props.extension);
    (props.target ?? document.documentElement).setAttribute("data-theme", slug);
    if (props.storageKey) {
        try { localStorage.setItem(props.storageKey, slug); } catch { /* ignore */ }
    }
    emit("change", slug);
}
```

The `typeof document === "undefined"` guard makes the function
no-op safely if ever called during SSR; in practice it isn't
called server-side because `onMounted` and `watch` only run on the
client.

## Reactivity

Only `props.value` (mirrored into `current`) is watched. Other props
are read inside the apply function on every fire, so changes take
effect on the next value change, not retroactively. This matches the
Svelte canonical's contract (see spec/index.md §5.4).

If a consumer wants to re-apply when, e.g., `themesUrl` changes
mid-session, they can write back to `value`:

```vue
<script setup lang="ts">
import { ref, watch } from "vue";
const theme = ref("light");
const themesUrl = ref("/assets/themes/");

watch(themesUrl, () => {
    const current = theme.value;
    theme.value = "";
    theme.value = current;
});
</script>
```

This forces the watch on `current` to fire.

## SSR

During server rendering, `onMounted` and `watch` are no-ops. The
template renders the root `<div>`, the hidden input, the button with
its glyph, and the `<ul hidden>` with its options, using whatever
`value` was passed; the managed `<link>` is not created (no DOM);
`data-theme` is not written.

The listbox always renders — closed, via the `hidden` attribute, not
via conditional rendering — so the server and client markup match
structurally regardless of interaction state. Option ids come from
`nextThemeChooserId()`, a module counter, which is why they are stable
across the SSR/hydration boundary in a way `Math.random()` would not
be.

That's the recipe for flicker-free SSR: pre-resolve the theme on
the server, write `data-theme="…"` on `<html>` via Nuxt's
`useHead`, and pass the resolved slug as `value`. See
[`./ssr.md`](./ssr.md).

## Unmount

`onBeforeUnmount` removes the document click listener and clears the
typeahead timer — both belong to the open/close lifecycle and must not
outlive the component.

It deliberately does **not** clean up the managed `<link>` or the
`data-theme` attribute:

- The chooser may be unmounted because the consumer navigated away
  from the settings page; the theme should stay applied.
- The next select mount reuses the same managed `<link>` (located
  by `data-lily-theme-chooser="{name}"`).

If a consumer wants to fully tear down the theme on unmount, they
can do it in `onBeforeUnmount` themselves:

```vue
<script setup lang="ts">
import { onBeforeUnmount } from "vue";

onBeforeUnmount(() => {
    document.head.querySelector('[data-lily-theme-chooser="theme"]')?.remove();
    document.documentElement.removeAttribute("data-theme");
});
</script>
```

This is rare. Most apps want the theme to outlive the chooser.
