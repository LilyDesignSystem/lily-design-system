# Concepts

How `LocalePicker` thinks about locale, where it sits in your stack,
and what it deliberately leaves to you.

## Three orthogonal concerns

A web app changes language across three independent axes:

| Axis                       | What changes                                               | Owner                                  |
| -------------------------- | ---------------------------------------------------------- | -------------------------------------- |
| **Document language**      | The `lang` attribute on `<html>`. Screen readers, search engines, hyphenation, font selection. | `LocalePicker` (this helper).        |
| **Writing direction**      | The `dir` attribute on `<html>`. Bidi text, scrollbar position, flexbox/grid mirror. | `LocalePicker` (auto-detected from the locale; opt out with `applyDir={false}`). |
| **Translated strings**     | The actual visible words on the page.                      | Your i18n library (react-intl, react-i18next, lingui, FormatJS, raw `Intl`). |

The helper owns the first two and signals the third via the controlled
`value` + `onChange` pair and the `lang` attribute (which most i18n
libraries don't read directly — they react to the controlled value).

The split matters because it lets you swap your i18n library without
rewriting the picker, and it lets the picker stay headless: zero CSS,
zero string tables, zero dependencies beyond React.

## What "headless" means here

The picker:

- Renders semantic HTML (`<fieldset>` + `<input type="radio">`) with
  exactly the ARIA the WAI-ARIA APG specifies for a radio group.
- Carries a stable kebab-case class hook (`locale-picker`,
  `locale-picker-option`, `locale-picker-option-label`) on every
  element so your CSS can target it without prefixes or specificity
  tricks.
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

## Why `<fieldset role="radiogroup">` by default

Three reasons:

1. **Discoverability**. The full set of options surfaces to assistive
   tech on first focus into the group, while a `<select>` requires the
   user to open the popover before the choices are announced.
2. **Symmetry with `ThemePicker`**. The sibling helper in this
   directory uses the same shape, so the two compose visually and
   semantically without surprises.
3. **Escape hatch is one render prop away**. The `children` render prop
   hands you the full state machine — locales, value, `setLocale`,
   `tagFor`, `isRtl`, `labelFor`, `name` — so a `<select>` or button
   group is a 10-line rewrite, not a fork.

For long locale lists (>~12), use the children render prop to render a
`<select>` or combobox. See
[examples/02-select.tsx](../examples/02-select.tsx).

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
  picker degrades to the default.

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

The picker matches the React convention:

| Mode         | Trigger                          | Who owns the value       |
| ------------ | -------------------------------- | ------------------------ |
| Uncontrolled | `value` prop omitted             | The picker (internal state) |
| Controlled   | `value` prop supplied            | The consumer's state     |

Uncontrolled is the easiest path; the picker resolves from storage,
navigator, or `defaultValue` on mount and manages re-renders.

Controlled is the right choice when:

- Another component reflects the same locale.
- You wire the value into a context provider or i18n library state.
- You want full control over the resolution order.

You always get `onChange` either way.

## React 19 client-component boundary

The picker file carries `"use client"` because it uses `useState`,
`useEffect`, `useRef`, and touches `document`. Under the App Router
that means consumer files that import the picker need `"use client"`
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
   and `.dir`. Drive a `click` to a radio and assert again.
3. **Controlled + onChange** — drive `value` programmatically and
   assert the same DOM observations.

See [../LocalePicker.test.tsx](../LocalePicker.test.tsx) for the
reference suite that covers every `spec.md` §7 acceptance item.

## Where this helper sits in Lily

`LocalePicker` is **not** part of the headless component catalog yet.
It lives in `lily-design-system-react-helpers/` as a sibling to
`ThemePicker`. The two compose:

- `ThemePicker` writes `data-theme` and a managed `<link>`.
- `LocalePicker` writes `lang` and `dir`.

Both share the `<fieldset role="radiogroup">` shape, the
`children`-render-prop escape hatch, and the same `storageKey` /
controlled-value pattern. Drop both at the top of your layout and the
two together cover the entire "visual personalisation + linguistic
personalisation" surface for a public-sector or healthcare app.
