# Lifecycle — ThemeSelect (Vue)

The Vue-flavoured walk-through of the select's lifecycle. The
canonical contract is in [`../spec/index.md`](../spec/index.md) §5; this file
maps the Svelte canonical's `$effect` lifecycle to Vue's
`onMounted` + `watch`.

## Lifecycle diagram

```
mount
  │
  ▼
onMounted ─► resolve initial value (props.value > storage > defaultValue > "light" > themes[0])
  │             │
  │             ▼
  │           if resolved !== props.value: emit("update:value", resolved)
  │             │      → watch on props.value fires → applyTheme(resolved)
  │             │
  │           else: applyTheme(resolved)
  ▼
applyTheme:
  1. getManagedLink().href = themeHref(themesUrl, slug, extension)
  2. (target ?? <html>).setAttribute("data-theme", slug)
  3. if storageKey: localStorage.setItem(storageKey, slug)
  4. emit("change", slug)

user changes the select
  │
  ▼
onSelectChange ─► emit("update:value", next)
  │                  │
  │                  ▼
  │                watch on props.value fires
  │                  │
  ▼                  ▼
  (v-model resolves)  applyTheme(next)
```

## Why `onMounted` + `watch`, not `watchEffect`

`watchEffect` would auto-track every prop it reads. We don't want
the select to re-apply when `themesUrl` or `extension` changes
without a corresponding `value` change — that would re-fetch the
stylesheet for no user-visible reason. An explicit
`watch(() => props.value, …)` keeps the dependency graph small and
predictable.

## Initial-value resolution

Inside `onMounted`:

```ts
onMounted(() => {
    let initial = props.value;
    if (!initial && props.storageKey) {
        try {
            initial = localStorage.getItem(props.storageKey) ?? "";
        } catch {
            // ignore private-mode / quota errors
        }
    }
    if (!initial) {
        initial =
            props.defaultValue ??
            (props.themes.includes("light") ? "light" : props.themes[0]) ??
            "";
    }
    if (initial && initial !== props.value) {
        emit("update:value", initial);
        return;
    }
    if (initial) applyTheme(initial);
});
```

Resolving and emitting `update:value` triggers the `watch` to apply
the theme; the dual-path makes initial mount idempotent whether or
not a non-empty `value` was supplied.

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

Only `props.value` is watched. Other props are read inside the
apply function on every fire, so changes take effect on the next
value change, not retroactively. This matches the Svelte canonical's
contract (see spec/index.md §5.4).

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

This forces the watch on `props.value` to fire.

## SSR

During server rendering, `onMounted` and `watch` are no-ops. The
template renders the `<select>` and its `<option>`s using whatever
`value` was passed; the managed `<link>` is not created (no DOM);
`data-theme` is not written.

That's the recipe for flicker-free SSR: pre-resolve the theme on
the server, write `data-theme="…"` on `<html>` via Nuxt's
`useHead`, and pass the resolved slug as `value`. See
[`./ssr.md`](./ssr.md).

## Unmount

The component does not clean up the managed `<link>` or the
`data-theme` attribute on unmount. That's intentional:

- The select may be unmounted because the consumer navigated away
  from the settings page; the theme should stay applied.
- The next select mount reuses the same managed `<link>` (located
  by `data-lily-theme-select="{name}"`).

If a consumer wants to fully tear down the theme on unmount, they
can do it in `onBeforeUnmount` themselves:

```vue
<script setup lang="ts">
import { onBeforeUnmount } from "vue";

onBeforeUnmount(() => {
    document.head.querySelector('[data-lily-theme-select="theme"]')?.remove();
    document.documentElement.removeAttribute("data-theme");
});
</script>
```

This is rare. Most apps want the theme to outlive the select.
