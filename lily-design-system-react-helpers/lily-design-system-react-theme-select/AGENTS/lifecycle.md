# AGENTS / lifecycle — ThemeSelect

Implementation lifecycle. Read [`../spec/index.md §5`](../spec/index.md#5-behaviour)
for the formal contract; this file documents the React 19 mechanics.

## Mount order

```
1. React renders the root <div>, the hidden input, the button, and the
   (hidden) listbox. No option is aria-selected until a value resolves,
   or the consumer-supplied `value` selects one.
2. First-mount useEffect (empty deps) runs:
   a. Resolves the initial slug from value/storage/default/light.
   b. If uncontrolled and slug differs from internal state → setState.
      Otherwise → applyTheme(slug) directly.
3. State change from step 2b triggers a re-render.
4. value-change useEffect runs (currentValue dep):
   a. applyTheme(currentValue).
   b. Writes data-theme, link.href, localStorage, calls onChange.
```

The open/close state machine is independent of this value lifecycle:
opening the listbox never applies a theme, and applying a theme happens
through `setTheme` → the value-change effect regardless of how the
selection was made (click, `Enter`, or `Space`).

## The two value-lifecycle effects

### Effect 1 — first-mount resolution

```tsx
const initialisedRef = React.useRef(false);
React.useEffect(() => {
    if (initialisedRef.current) return;
    initialisedRef.current = true;

    const initial = resolveInitialTheme(
        currentValue || undefined,
        storageKey,
        defaultValue,
        themes,
    );
    if (!initial) return;

    if (isControlled) {
        applyTheme(initial);
    } else {
        if (initial !== internalValue) {
            setInternalValue(initial);
        } else {
            applyTheme(initial);
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
```

Properties:

- Runs exactly once per component instance, gated by `initialisedRef`.
- The empty dep array is intentional. The eslint comment suppresses
  the "exhaustive-deps" lint because the resolver reads multiple
  props but should not re-run when they change.
- StrictMode-safe: double-mount in development still only runs the
  resolver once because the ref persists across the unmount.

### Effect 2 — value-change re-apply

```tsx
React.useEffect(() => {
    if (!initialisedRef.current) return;
    if (!currentValue) return;
    applyTheme(currentValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [currentValue]);
```

Properties:

- Gated on `initialisedRef` so it does not race with the first-mount
  effect.
- Empty-string guard skips the initial render's empty value.
- Only `currentValue` in deps. Other props (`themesUrl`, `target`,
  etc.) are deliberately not dependencies — they take effect on the
  next slug change, not retroactively, per [`spec/index.md §5.4`](../spec/index.md#54-reactivity).

## The four interaction effects

These run alongside the value lifecycle and never apply a theme.

| Effect | Deps | What it does |
| ------ | ---- | ------------ |
| Focus transfer | `[open]` | On open, `listRef.current?.focus()`. On close, focus the button — but only when `refocusRef.current` was set, i.e. the close came from a selection or `Escape`, not from `Tab` / outside click / focus loss. |
| Scroll into view | `[open, activeIndex]` | `scrollIntoView({ block: "nearest" })` on the active option. jsdom does not implement it, hence the optional call. |
| Outside click | `[open]` | While open, a `document` `click` listener closes the list when the target is outside `rootRef`. Removed on close / unmount. |
| Typeahead cleanup | `[]` | Clears any pending buffer-reset timer on unmount. |

Focus moves in an effect rather than in the handler because the target
element's `hidden` attribute is only removed after the commit — focusing
a still-`hidden` element is a no-op.

`onRootBlur` is wired to the root `<div>`'s `onBlur`. React's `onBlur`
is the delegated equivalent of the native `focusout` event: it bubbles,
so the root sees focus leaving any descendant. It closes with
`refocus = false`, since focus has already gone somewhere else.

## resolveInitialTheme

```tsx
function resolveInitialTheme(
    value: string | undefined,
    storageKey: string | undefined,
    defaultValue: string | undefined,
    themes: string[],
): string {
    if (value) return value;
    if (storageKey) {
        try {
            const stored = localStorage.getItem(storageKey);
            if (stored) return stored;
        } catch {
            // ignore privacy errors
        }
    }
    if (defaultValue) return defaultValue;
    if (themes.includes("light")) return "light";
    return themes[0] ?? "";
}
```

Order matches [`spec/index.md §5.2`](../spec/index.md#52-initial-value-resolution):

1. consumer `value` (controlled)
2. `localStorage[storageKey]` (try/catch)
3. `defaultValue`
4. `"light"` (if in themes)
5. `themes[0]`
6. `""` (no apply)

## applyTheme

```tsx
function applyTheme(slug: string): void {
    if (typeof document === "undefined" || !slug) return;
    getManagedLink().href = themeHref(themesUrl, slug, extension);
    (target ?? document.documentElement).setAttribute("data-theme", slug);
    if (storageKey) {
        try {
            localStorage.setItem(storageKey, slug);
        } catch {
            // ignore quota / privacy errors
        }
    }
    onChange?.(slug);
}
```

Four ordered steps from [`spec/index.md §5.3`](../spec/index.md#53-applying-a-theme):

1. Link href swap.
2. data-theme attribute write.
3. localStorage write (try/catch).
4. onChange callback.

The `typeof document === "undefined"` guard makes the function
no-op on the server (defensive — it should only ever run inside a
useEffect anyway).

## getManagedLink

```tsx
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

Idempotent. On the first apply for a given `name`, creates a fresh
`<link>`. On every subsequent apply, returns the existing one.
Multiple selects with distinct `name` values each get their own
managed link.

## setTheme

```tsx
function setTheme(slug: string): void {
    if (isControlled) {
        applyTheme(slug);
    } else {
        setInternalValue(slug);
    }
}
```

The single write path, reached from `choose(index)` — which is called by
an option click and by `Enter` / `Space` on the listbox.

In **controlled** mode the consumer owns `value`, so the theme is
applied straight away; the DOM stays in step even if the consumer never
writes the value back. In **uncontrolled** mode only internal state is
written, and the value-change effect performs the apply — so
`applyTheme` runs exactly once per change either way.

## choose

```tsx
function choose(index: number): void {
    const slug = themes[index];
    if (slug) setTheme(slug);
    closeList();
}
```

`closeList()` defaults to `refocus = true`, which is why committing via
click or keyboard both hand focus back to the button.

## SSR

During server rendering:

- `typeof document === "undefined"` so `applyTheme` no-ops if
  called (defensive).
- `useEffect` never runs on the server.
- `localStorage` is never read.
- The listbox renders `hidden` with `open === false`, and `value`
  controls which option carries `aria-selected="true"`. If `value` is
  empty, no option is selected.
- Option ids come from `useId`, so the server and client agree and
  hydration is clean.

After hydration the effects run as documented above.

## StrictMode

React 19 development StrictMode double-invokes effects to surface
mount/unmount bugs. The `initialisedRef` guard means:

- First development mount: ref is `false`, effect runs, ref is set
  to `true`.
- StrictMode unmount + remount: ref persists (it's part of the
  component instance), effect early-returns.

No StrictMode-specific code needed beyond the guard.

## Memory safety

The managed `<link>` is **not** removed on unmount. This is
intentional: removing it would unload the active theme CSS during
the unmount/remount transition (e.g. when the select is conditionally
rendered) and cause a visible flash.

If a consumer needs to clean up (e.g. when fully removing the select
from the app), they remove the `<link>` themselves:

```tsx
useEffect(() => () => {
    document.head
        .querySelectorAll('link[data-lily-theme-select]')
        .forEach(el => el.remove());
}, []);
```

## Re-render frequency

The select re-renders on:

- `value` prop change (controlled mode).
- `internalValue` state change (uncontrolled mode).
- `open` state change (button click, open key, close key, outside
  click, focus loss).
- `activeIndex` state change (every Arrow / Home / End / typeahead
  keystroke while open).
- Any other prop change (themes, themesUrl, label, …).

It does NOT re-render on:

- `localStorage` changes from another tab (no `storage` event
  listener).
- `data-theme` attribute changes from outside (no MutationObserver).

Consumers who need cross-tab sync wire it themselves via
`window.addEventListener("storage", …)` and write to `value`.
