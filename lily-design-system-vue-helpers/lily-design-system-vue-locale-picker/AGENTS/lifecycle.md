# Lifecycle — LocaleChooser (Vue)

The Vue-flavoured walk-through of the chooser's lifecycle. The
canonical contract is in [`../spec/index.md`](../spec/index.md) §5; this file
maps the Svelte canonical's `$effect` lifecycle to Vue's
`onMounted` + `watch`.

## Lifecycle diagram

```
mount
  │
  ▼
onMounted ─► resolve initial value (props.value > storage > navigator > defaultValue > "en" > locales[0])
  │             │
  │             ▼
  │           if resolved !== props.value: emit("update:value", resolved)
  │             │      → watch on props.value fires → applyLocale(resolved)
  │             │
  │           else: applyLocale(resolved)
  ▼
applyLocale:
  1. (target ?? <html>).setAttribute("lang", bcp47LocaleTag(code))
  2. if applyDir: (target ?? <html>).setAttribute("dir", isRtl(code) ? "rtl" : "ltr")
  3. if storageKey: localStorage.setItem(storageKey, code)
  4. emit("change", code) — consumer-form, not BCP 47 normalised

user opens the listbox (click, ArrowDown/ArrowUp/Enter/Space)
  │
  ▼
openList ─► activeIndex = selected (or 0, or last for ArrowUp)
  │         open = true; await nextTick(); listEl.focus()
  │
  ▼
user commits (click an option, or Enter/Space on the active one)
  │
  ▼
choose(index) ─► setLocale(code) ─► current = code; emit("update:value", code)
  │                                    │
  │                                    ▼
  │                                  watch on `current` fires
  │                                    │
  ▼                                    ▼
closeList() → button.focus()          applyLocale(code)
```

Escape and Tab take the `closeList` branch without ever calling
`setLocale`, so cancelling never applies a locale.

## Why `onMounted` + `watch`, not `watchEffect`

`watchEffect` would auto-track every prop it reads. We don't want
the chooser to re-apply when `target` or `applyDir` change without a
corresponding `value` change. An explicit
`watch(() => props.value, …)` keeps the dependency graph small and
predictable.

## Initial-value resolution

Inside `onMounted`, which also registers the outside-click listener
that closes the listbox:

```ts
onMounted(() => {
    document.addEventListener("click", onDocumentClick);

    let initial = current.value;

    if (!initial && props.storageKey) {
        try {
            initial = localStorage.getItem(props.storageKey) ?? "";
        } catch {
            // ignore private-mode / quota errors
        }
    }

    if (!initial && props.detectFromNavigator && typeof navigator !== "undefined") {
        const navLangs =
            navigator.languages && navigator.languages.length > 0
                ? Array.from(navigator.languages)
                : navigator.language
                  ? [navigator.language]
                  : [];
        initial = matchNavigatorLanguage(navLangs, props.locales);
    }

    if (!initial) {
        initial =
            props.defaultValue ??
            (props.locales.includes("en") ? "en" : props.locales[0]) ??
            "";
    }

    if (initial && initial !== current.value) {
        current.value = initial;
        emit("update:value", initial);
        return;
    }
    if (initial) applyLocale(initial);
});
```

Resolving and emitting `update:value` triggers the `watch` to apply
the locale; the dual-path makes initial mount idempotent whether or
not a non-empty `value` was supplied.

## Apply

```ts
function applyLocale(code: string): void {
    if (typeof document === "undefined" || !code) return;
    const root = props.target ?? document.documentElement;
    root.setAttribute("lang", bcp47LocaleTag(code));
    if (props.applyDir) {
        root.setAttribute("dir", isRtlLocale(code) ? "rtl" : "ltr");
    }
    if (props.storageKey) {
        try { localStorage.setItem(props.storageKey, code); } catch { /* ignore */ }
    }
    emit("change", code);
}
```

The `typeof document === "undefined"` guard makes the function
no-op safely if ever called during SSR; in practice it isn't
called server-side because `onMounted` and `watch` only run on the
client.

## Why `change` emits the consumer form, not the BCP 47 form

The `lang` attribute on the DOM is normalised to BCP 47 hyphen
form, but the `change` event payload (and the bindable `value`)
preserves the consumer's original form (`en_US` if the consumer
put `en_US` in `locales`). This keeps round-trips lossless and
lets the consumer's i18n library — which might use the underscore
form internally — receive the same string it stored.

## Reactivity

Two watches, both narrow. One mirrors an externally-supplied
`props.value` into the internal `current` ref; the other watches
`current` and applies. Nothing else is watched: other props are read
inside the apply function on every fire, so changes take effect on
the next value change, not retroactively.

The open / active state (`open`, `activeIndex`) is plain local `ref`
state. It never feeds back into `value`, so opening and arrowing
around the listbox applies nothing until the user commits.

If a consumer wants to re-apply when `target` changes, they can
write back to `value`:

```vue
<script setup lang="ts">
import { ref, watch } from "vue";
const locale = ref("en");
const target = ref<HTMLElement | null>(null);

watch(target, () => {
    const current = locale.value;
    locale.value = "";
    locale.value = current;
});
</script>
```

## SSR

During server rendering, `onMounted` and `watch` are no-ops. The
template renders the button and the (hidden) listbox using whatever
`value` was passed; the `lang` and `dir` attributes are not written to
`<html>` (no DOM). Element ids come from the `nextLocaleChooserId()`
module counter rather than `Math.random()` / `Date.now()`, so the
server and client markup agree.

That's the recipe for flicker-free SSR: pre-resolve the locale on
the server, write `lang="…"` and `dir="…"` on `<html>` via Nuxt's
`useHead`, and pass the resolved code as `value`. See
[`./ssr.md`](./ssr.md).

## Unmount

`onBeforeUnmount` removes the document-level click listener and
clears the pending typeahead timer. Both are the component's own
resources, so both go.

The component does **not** clean up `lang` / `dir` on unmount. That's
intentional: the chooser may be unmounted because the consumer
navigated away from a settings page; the locale should stay
applied.

If a consumer wants to fully reset, they can do it in
`onBeforeUnmount` themselves.

## Watch vs the navigator-detection helper

`matchNavigatorLanguage` is only called inside `onMounted`. The
chooser never re-runs detection mid-session — the user's choice
should win over `navigator.languages` once expressed. If a consumer
wants to re-detect (e.g. on a settings reset), they can call the
exported helper manually and write the result to the bound `value`.
