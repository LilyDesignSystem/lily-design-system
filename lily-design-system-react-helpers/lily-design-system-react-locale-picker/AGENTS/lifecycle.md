# AGENTS / lifecycle — LocaleChooser

Implementation lifecycle. Read [`../spec/index.md §5`](../spec/index.md#5-behaviour)
for the formal contract; this file documents the React 19 mechanics.

## Mount order

```
1. React renders the root <div>, the hidden input, the button, and the
   listbox (closed, `hidden`). `useId` fixes the list and option ids.
2. First-mount useEffect (empty deps) runs:
   a. Resolves the initial code from value/storage/navigator/default.
   b. If uncontrolled and code differs from internal state → setState.
      Otherwise → applyLocale(code) directly.
3. State change from step 2b triggers a re-render.
4. value-change useEffect runs (currentValue dep):
   a. applyLocale(currentValue).
   b. Writes lang, dir, localStorage, calls onChange.
```

The disclosure state (`open`, `activeIndex`) is independent of the
locale lifecycle and starts closed on every mount.

## The locale effects

### Effect 1 — first-mount resolution

```tsx
const initialisedRef = React.useRef(false);
React.useEffect(() => {
    if (initialisedRef.current) return;
    initialisedRef.current = true;

    const initial = resolveInitialLocale(
        currentValue || undefined,
        storageKey,
        detectFromNavigator,
        defaultValue,
        locales,
    );
    if (!initial) return;

    if (isControlled) {
        applyLocale(initial);
    } else {
        if (initial !== internalValue) {
            setInternalValue(initial);
        } else {
            applyLocale(initial);
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
```

Properties:

- Runs exactly once per component instance, gated by `initialisedRef`.
- StrictMode-safe.
- Reads `navigator.languages` only on the client (via the
  resolver), guarded by `typeof navigator !== "undefined"`.

### Effect 2 — value-change re-apply

```tsx
React.useEffect(() => {
    if (!initialisedRef.current) return;
    if (!currentValue) return;
    applyLocale(currentValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [currentValue]);
```

Properties:

- Gated on `initialisedRef`.
- Empty-string guard skips initial render's empty value.
- Only `currentValue` in deps.

## The disclosure effects

Four more effects manage the listbox. They never touch the locale.

### Effect 3 — focus transfer, keyed on `open`

```tsx
React.useEffect(() => {
    if (open) {
        listRef.current?.focus();
    } else if (refocusRef.current) {
        refocusRef.current = false;
        buttonRef.current?.focus();
    }
}, [open]);
```

Focus moves *after* the commit, so the `<ul>` is already unhidden when
`.focus()` runs. `refocusRef` is set by `closeList(true)` — selection,
`Escape`, and the button toggle — and left unset by `closeList(false)`
for `Tab`, outside clicks, and focus-out, where the user has already
chosen where focus goes.

### Effect 4 — keep the active option in view

```tsx
React.useEffect(() => {
    if (open) scrollActiveIntoView(activeIndex);
}, [open, activeIndex]);
```

Calls `el?.scrollIntoView?.({ block: "nearest" })`. The optional call
matters: jsdom does not implement `scrollIntoView`, so tests would
throw without it.

### Effect 5 — outside-click close

```tsx
React.useEffect(() => {
    if (!open) return;
    function onDocumentClick(event: MouseEvent) { /* … */ }
    document.addEventListener("click", onDocumentClick);
    return () => document.removeEventListener("click", onDocumentClick);
}, [open]);
```

Only subscribed while open, and always torn down. Closes with
`closeList(false)`.

### Effect 6 — typeahead timer cleanup

```tsx
React.useEffect(() => () => clearTimeout(typeaheadTimerRef.current), []);
```

Drops any pending 500 ms buffer-reset timer on unmount.

## Focus-out closing

`onRootBlur` is wired to the root `<div>`'s `onBlur`. React's `onBlur`
is the delegated equivalent of the native `focusout` event: unlike the
DOM's own `blur`, it bubbles, so the root sees focus leaving any
descendant. The handler returns early when `event.relatedTarget` is
still inside the root (button ↔ list moves), and otherwise closes with
`closeList(false)`.

## Selecting an option

```tsx
function choose(index: number): void {
    const code = locales[index];
    if (code) setLocale(code);
    closeList();
}
```

Used by both `Enter` / `Space` on the list and by an option's
`onClick`, so pointer and keyboard selection share one path.

## resolveInitialLocale

```tsx
function resolveInitialLocale(
    value: string | undefined,
    storageKey: string | undefined,
    detectFromNavigator: boolean,
    defaultValue: string | undefined,
    locales: string[],
): string {
    if (value) return value;
    if (storageKey) {
        try {
            const stored = localStorage.getItem(storageKey);
            if (stored) return stored;
        } catch { /* ignore */ }
    }
    if (detectFromNavigator && typeof navigator !== "undefined") {
        const navLangs = navigator.languages && navigator.languages.length > 0
            ? Array.from(navigator.languages)
            : navigator.language ? [navigator.language] : [];
        const match = matchNavigatorLanguage(navLangs, locales);
        if (match) return match;
    }
    if (defaultValue) return defaultValue;
    if (locales.includes("en")) return "en";
    return locales[0] ?? "";
}
```

Order matches [`spec/index.md §5.2`](../spec/index.md#52-initial-value-resolution):

1. consumer `value` (controlled)
2. `localStorage[storageKey]`
3. `navigator.languages` match (if `detectFromNavigator`)
4. `defaultValue`
5. `"en"` (if in locales)
6. `locales[0]`
7. `""` (no apply)

## matchNavigatorLanguage

```ts
export function matchNavigatorLanguage(
    navLangs: readonly string[],
    locales: readonly string[],
): string | "" {
    const lc = (s: string) => s.toLowerCase().replace(/_/g, "-");
    const localesLc = locales.map(lc);
    for (const raw of navLangs) {
        const nav = lc(raw);
        // 1. Exact match.
        const exactIndex = localesLc.indexOf(nav);
        if (exactIndex !== -1) return locales[exactIndex];
        // 2. Language-only match.
        const navBase = nav.split("-")[0];
        for (let i = 0; i < locales.length; i++) {
            const base = localesLc[i].split("-")[0];
            if (base === navBase) return locales[i];
        }
    }
    return "";
}
```

A simple two-step match (exact then language-only). NOT a full
RFC 4647 best-fit matcher — consumers needing that bring their own.

## applyLocale

```tsx
function applyLocale(code: string): void {
    if (typeof document === "undefined" || !code) return;
    const root = target ?? document.documentElement;
    root.setAttribute("lang", bcp47LocaleTag(code));
    if (applyDir) {
        root.setAttribute("dir", isRtlLocale(code) ? "rtl" : "ltr");
    }
    if (storageKey) {
        try {
            localStorage.setItem(storageKey, code);
        } catch { /* ignore */ }
    }
    onChange?.(code);
}
```

Five ordered steps from [`spec/index.md §5.5`](../spec/index.md#55-applying-a-locale):

1. Resolve target (`target ?? document.documentElement`).
2. Set `lang` to BCP 47 form.
3. Set `dir` (if `applyDir`).
4. Write storage (try/catch).
5. Call `onChange(code)` with the consumer-form code.

The `onChange` argument is the original consumer-form code (`en_US`
or `en-US` exactly as the consumer supplied), not the BCP 47-normalised
tag.

## labelFor

```ts
function labelFor(locale: string): string {
    if (locale in localeLabels) return localeLabels[locale];
    if (locale in defaultLocaleLabels) return defaultLocaleLabels[locale];
    const intl = intlDisplayName(locale);
    if (intl) return intl;
    return locale;
}
```

Four-step resolution per [`spec/index.md §5.4`](../spec/index.md#54-default-labels):

1. `localeLabels[code]` — consumer override.
2. `defaultLocaleLabels[code]` — built-in English table.
3. `Intl.DisplayNames` — opportunistic runtime lookup.
4. Raw code — last resort.

## intlDisplayName

```ts
function intlDisplayName(locale: string): string {
    try {
        const env = typeof navigator !== "undefined" && navigator.language
            ? navigator.language
            : "en";
        const dn = new Intl.DisplayNames([env], { type: "language" });
        return dn.of(bcp47LocaleTag(locale)) ?? "";
    } catch {
        return "";
    }
}
```

Try/catch guards old browsers, jsdom, and any environment where
`Intl.DisplayNames` is missing.

## setLocale

```tsx
function setLocale(code: string): void {
    if (isControlled) {
        // The consumer owns `value`; apply straight away so the DOM
        // stays in step even if they never write the value back.
        applyLocale(code);
    } else {
        // Effect 2 runs applyLocale, so the locale is applied exactly
        // once per change.
        setInternalValue(code);
    }
}
```

The two branches are deliberately asymmetric. In controlled mode the
component cannot rely on `value` changing (the consumer may ignore
`onChange`), so it applies directly. In uncontrolled mode the state
write is enough — Effect 2 fires on the new `currentValue` and applies
it, so applying here too would double-fire `onChange`.

`setLocale` is reached only through `choose(index)`; it is no longer
exposed on `ChildArgs`, because `children` now renders the button glyph
rather than the options.

## SSR

During server rendering:

- `typeof document === "undefined"` so `applyLocale` no-ops.
- `useEffect` never runs — no focus transfer, no document click
  listener, no timers.
- `navigator.languages` not read.
- The listbox renders closed (`hidden`), with `aria-expanded="false"`
  and no `aria-activedescendant`.
- `useId` produces the same list and option ids on server and client,
  so `aria-controls` and the option ids hydrate without mismatch.

After hydration the effects run as documented above.

## Memory safety

The select writes to `document.documentElement`'s `lang` and `dir`
attributes on every apply. It does NOT remove them on unmount —
that would clobber the document's language signal during a
transient unmount.

If a consumer needs to clean up:

```tsx
useEffect(() => () => {
    document.documentElement.removeAttribute("lang");
    document.documentElement.removeAttribute("dir");
}, []);
```

Almost never needed.

## Re-render frequency

The select re-renders on:

- `value` prop change (controlled).
- `internalValue` state change (uncontrolled, during resolution).
- `open` / `activeIndex` state change (every arrow key, every typeahead
  hit, every open and close).
- Any other prop change.

It does NOT re-render on:

- `localStorage` changes from another tab (no `storage` listener).
- `lang` / `dir` attribute changes from outside.

Cross-tab sync is the consumer's job; wire a `storage` event
listener and write to `value`.
