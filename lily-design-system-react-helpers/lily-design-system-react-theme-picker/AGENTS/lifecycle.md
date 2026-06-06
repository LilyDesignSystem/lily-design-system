# AGENTS / lifecycle — ThemePicker

Implementation lifecycle. Read [`../spec.md §5`](../spec.md#5-behaviour)
for the formal contract; this file documents the React 19 mechanics.

## Mount order

```
1. React renders <fieldset> with no checked radio (or with checked
   per the consumer-supplied `value`).
2. First-mount useEffect (empty deps) runs:
   a. Resolves the initial slug from value/storage/default/light.
   b. If uncontrolled and slug differs from internal state → setState.
      Otherwise → applyTheme(slug) directly.
3. State change from step 2b triggers a re-render.
4. value-change useEffect runs (currentValue dep):
   a. applyTheme(currentValue).
   b. Writes data-theme, link.href, localStorage, calls onChange.
```

## The two effects

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
  next slug change, not retroactively, per [`spec.md §5.4`](../spec.md#54-reactivity).

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

Order matches [`spec.md §5.2`](../spec.md#52-initial-value-resolution):

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

Four ordered steps from [`spec.md §5.3`](../spec.md#53-applying-a-theme):

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
    const selector = `link[data-lily-theme-picker="${name}"]`;
    let link = document.head.querySelector<HTMLLinkElement>(selector);
    if (!link) {
        link = document.createElement("link");
        link.rel = "stylesheet";
        link.setAttribute("data-lily-theme-picker", name);
        document.head.appendChild(link);
    }
    return link;
}
```

Idempotent. On the first apply for a given `name`, creates a fresh
`<link>`. On every subsequent apply, returns the existing one.
Multiple pickers with distinct `name` values each get their own
managed link.

## setTheme

```tsx
function setTheme(slug: string): void {
    if (!isControlled) setInternalValue(slug);
    applyTheme(slug);
}
```

Direct apply path for the `children` render prop and for the
`onChange` handler on the default radio markup. In uncontrolled
mode it both updates internal state AND applies — the apply
happens immediately so the user sees the change instantly, and
the state update triggers a re-render (but effect 2 is gated so it
doesn't re-apply).

## onInputChange

The native radio's onChange handler:

```tsx
function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTheme(e.target.value);
}
```

A plain function (no `useCallback`) because the picker's render
identity changes with every state update anyway, so memoising
this handler doesn't reduce work meaningfully.

## SSR

During server rendering:

- `typeof document === "undefined"` so `applyTheme` no-ops if
  called (defensive).
- `useEffect` never runs on the server.
- `localStorage` is never read.
- The `<fieldset>` renders with `value` controlling which radio is
  checked. If `value` is empty, no radio is checked.

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
the unmount/remount transition (e.g. when the picker is conditionally
rendered) and cause a visible flash.

If a consumer needs to clean up (e.g. when fully removing the picker
from the app), they remove the `<link>` themselves:

```tsx
useEffect(() => () => {
    document.head
        .querySelectorAll('link[data-lily-theme-picker]')
        .forEach(el => el.remove());
}, []);
```

## Re-render frequency

The picker re-renders on:

- `value` prop change (controlled mode).
- `internalValue` state change (uncontrolled mode, only during
  first-mount resolution).
- Any other prop change (themes, themesUrl, label, …).

It does NOT re-render on:

- `localStorage` changes from another tab (no `storage` event
  listener).
- `data-theme` attribute changes from outside (no MutationObserver).

Consumers who need cross-tab sync wire it themselves via
`window.addEventListener("storage", …)` and write to `value`.
