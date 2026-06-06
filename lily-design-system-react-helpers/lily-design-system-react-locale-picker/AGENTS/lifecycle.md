# AGENTS / lifecycle — LocalePicker

Implementation lifecycle. Read [`../spec.md §5`](../spec.md#5-behaviour)
for the formal contract; this file documents the React 19 mechanics.

## Mount order

```
1. React renders <fieldset> with no checked radio (or with checked
   per the consumer-supplied `value`).
2. First-mount useEffect (empty deps) runs:
   a. Resolves the initial code from value/storage/navigator/default.
   b. If uncontrolled and code differs from internal state → setState.
      Otherwise → applyLocale(code) directly.
3. State change from step 2b triggers a re-render.
4. value-change useEffect runs (currentValue dep):
   a. applyLocale(currentValue).
   b. Writes lang, dir, localStorage, calls onChange.
```

## The two effects

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

Order matches [`spec.md §5.2`](../spec.md#52-initial-value-resolution):

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

Five ordered steps from [`spec.md §5.5`](../spec.md#55-applying-a-locale):

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

Four-step resolution per [`spec.md §5.4`](../spec.md#54-default-labels):

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
    if (!isControlled) setInternalValue(code);
    applyLocale(code);
}
```

Used by the default radio onChange handler and by the `children`
render prop. In uncontrolled mode updates internal state AND
applies; in controlled mode the consumer's `onChange` (inside
`applyLocale`) updates the prop.

## SSR

During server rendering:

- `typeof document === "undefined"` so `applyLocale` no-ops.
- `useEffect` never runs.
- `navigator.languages` not read.
- The `<fieldset>` renders with `value` controlling which radio is
  checked.

After hydration the effects run as documented above.

## Memory safety

The picker writes to `document.documentElement`'s `lang` and `dir`
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

The picker re-renders on:

- `value` prop change (controlled).
- `internalValue` state change (uncontrolled, during resolution).
- Any other prop change.

It does NOT re-render on:

- `localStorage` changes from another tab (no `storage` listener).
- `lang` / `dir` attribute changes from outside.

Cross-tab sync is the consumer's job; wire a `storage` event
listener and write to `value`.
