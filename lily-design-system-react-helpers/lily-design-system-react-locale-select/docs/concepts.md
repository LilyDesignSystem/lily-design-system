# Concepts

How `LocaleSelect` thinks about locale, where it sits in your stack,
and what it deliberately leaves to you.

## Three orthogonal concerns

A web app changes language across three independent axes:

| Axis                       | What changes                                               | Owner                                  |
| -------------------------- | ---------------------------------------------------------- | -------------------------------------- |
| **Document language**      | The `lang` attribute on `<html>`. Screen readers, search engines, hyphenation, font selection. | `LocaleSelect` (this helper).        |
| **Writing direction**      | The `dir` attribute on `<html>`. Bidi text, scrollbar position, flexbox/grid mirror. | `LocaleSelect` (auto-detected from the locale; opt out with `applyDir={false}`). |
| **Translated strings**     | The actual visible words on the page.                      | Your i18n library (react-intl, react-i18next, lingui, FormatJS, raw `Intl`). |

The helper owns the first two and signals the third via the controlled
`value` + `onChange` pair and the `lang` attribute (which most i18n
libraries don't read directly — they react to the controlled value).

The split matters because it lets you swap your i18n library without
rewriting the select, and it lets the select stay headless: zero CSS,
zero string tables, zero dependencies beyond React.

## What "headless" means here

The select:

- Renders semantic HTML (a native `<select>` with `<option>` children),
  which the browser exposes as a `combobox` with `option` children.
- Carries a stable kebab-case class hook (`locale-select` on the
  `<select>`, `locale-select-option` on each `<option>`) so your CSS can
  target it without prefixes or specificity tricks.
- Ships **no** colour, spacing, typography, font, icon, or animation
  decisions. You supply all of that.
- Ships **no** translated strings. The `label` prop and `localeLabels`
  prop are passed through verbatim.

## The lifecycle

Each instance manages a single `value`:

```
       ┌───────────────────────────────┐
       │   useEffect (mount-only)      │
       │                               │
   value (consumer) ─── if empty ───► storage ──► navigator ──► defaultValue ──► "en" ──► locales[0]
       │                               │
       │  writes back via onChange     │
       └───────────────────────────────┘
                       │
                       ▼
       ┌───────────────────────────────┐
       │   useEffect (every value)     │
       │                               │
       │   target.lang = BCP-47(value) │
       │   target.dir  = rtl|ltr       │
       │   localStorage.setItem(...)   │
       │   onChange(value)             │
       └───────────────────────────────┘
```

The effects are intentional — both DOM mutation and storage are side
effects, so they belong in `useEffect`, not `useMemo`.

## Why a native `<select>` by default

Three reasons:

1. **Compactness**. A native `<select>` is one widget regardless of how
   many locales you support, so it scales cleanly from 2 to 200+ codes
   without dominating the layout.
2. **Symmetry with `ThemeSelect`**. The sibling helper in this
   directory uses the same shape, so the two compose visually and
   semantically without surprises.
3. **Escape hatch is one render prop away**. The `children` render prop
   hands you the full state machine — locales, value, `setLocale`,
   `tagFor`, `isRtl`, `labelFor`, `name` — so a custom `<select>` or
   button group is a 10-line rewrite, not a fork.

For very long locale lists (50+), use the children render prop to render
a combobox with type-ahead. See
[examples/10-combobox.tsx](../examples/10-combobox.tsx).

## Why a separate `value` and `target.lang`

The controlled `value` is in **consumer form** — whatever you put into
`locales` (`en_US` or `en-US` or `en`). It round-trips losslessly via
`onChange`.

The `target.lang` attribute is in **BCP 47 form** — always hyphens
(`en-US`). This is what `<html>` and HTML spec require.

Keeping them separate means:

- Your existing locale store (CLDR-style `en_US`) stays untouched.
- `<html lang>` is spec-compliant without consumer code touching the
  conversion.
- Controlled-mode round-trips Just Work.

## Where storage fits in

`storageKey` is optional and opt-in. When set:

- Selection writes synchronously to `localStorage`.
- On a fresh mount with no `value` prop, the stored value is read back
  before navigator detection.
- Storage errors (private mode, quota) are swallowed silently; the
  select degrades to the default.

If you have a server (Next.js, Remix, Astro, etc.), prefer a cookie
instead — it survives the round-trip and avoids a flash of default
locale on first paint. Pass the cookie value as the initial `value`
prop. See [./ssr.md](./ssr.md).

## Where navigator detection fits in

`detectFromNavigator` is opt-in. When set, the first mount inspects
`navigator.languages` and picks the first entry whose language matches
something in your `locales` array. The match algorithm is simple
(exact first, language-only second) — not RFC 4647 best-fit. If you
need stronger negotiation, run your own resolver and pass the result as
`value`.

## Controlled vs uncontrolled

The select matches the React convention:

| Mode         | Trigger                          | Who owns the value       |
| ------------ | -------------------------------- | ------------------------ |
| Uncontrolled | `value` prop omitted             | The select (internal state) |
| Controlled   | `value` prop supplied            | The consumer's state     |

Uncontrolled is the easiest path; the select resolves from storage,
navigator, or `defaultValue` on mount and manages re-renders.

Controlled is the right choice when:

- Another component reflects the same locale.
- You wire the value into a context provider or i18n library state.
- You want full control over the resolution order.

You always get `onChange` either way.

## React 19 client-component boundary

The select file carries `"use client"` because it uses `useState`,
`useEffect`, `useRef`, and touches `document`. Under the App Router
that means consumer files that import the select need `"use client"`
too if they call hooks.

The pure helpers (`bcp47LocaleTag`, `isRtlLocale`, `localeName`,
`matchNavigatorLanguage`) are safe to import from server components.
They have no React dependency and no DOM access.

## How to test it

Three layers, mirroring the lifecycle:

1. **Pure helpers** — `bcp47LocaleTag`, `isRtlLocale`, `localeName`,
   `matchNavigatorLanguage` are pure functions. Unit-test them in
   isolation.
2. **DOM contract** — after mount, assert `document.documentElement.lang`
   and `.dir`. Drive a `change` on the `<select>` and assert again.
3. **Controlled + onChange** — drive `value` programmatically and
   assert the same DOM observations.

See [../LocaleSelect.test.tsx](../LocaleSelect.test.tsx) for the
reference suite that covers every `spec.md` §7 acceptance item.

## Where this helper sits in Lily

`LocaleSelect` is **not** part of the headless component catalog yet.
It lives in `lily-design-system-react-helpers/` as a sibling to
`ThemeSelect`. The two compose:

- `ThemeSelect` writes `data-theme` and a managed `<link>`.
- `LocaleSelect` writes `lang` and `dir`.

Both share the native `<select>` shape, the
`children`-render-prop escape hatch, and the same `storageKey` /
controlled-value pattern. Drop both at the top of your layout and the
two together cover the entire "visual personalisation + linguistic
personalisation" surface for a public-sector or healthcare app.
