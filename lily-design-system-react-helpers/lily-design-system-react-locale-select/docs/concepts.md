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

- Renders semantic HTML with explicit ARIA — a `<button>` that opens a
  `<ul role="listbox">` of `<li role="option">` children, following the
  WAI-ARIA APG Listbox pattern.
- Carries stable kebab-case class hooks — `locale-select` on the root
  `<div>`, plus `locale-select-button`, `locale-select-icon`,
  `locale-select-list`, and `locale-select-option` — so your CSS can
  target any part without prefixes or specificity tricks. State rides
  on `aria-selected` and `data-active`.
- Ships **no** colour, spacing, typography, font, icon, or animation
  decisions. You supply all of that — **including the list's
  positioning**, since the package ships no CSS at all. Open and close
  are the `hidden` attribute and nothing more.
- Ships **no** translated strings. The `label` prop and `localeLabels`
  prop are passed through verbatim.

The one visual decision it does make is the default glyph: U+1F310
GLOBE WITH MERIDIANS, as a text character rather than a bundled asset.
It is `aria-hidden`, and `children` replaces it — see
[accessibility.md](./accessibility.md) for why you might want to.

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

## Why a button and a listbox rather than a `<select>`

Three reasons:

1. **Compactness**. The closed control is an icon, so it costs one
   glyph of width no matter how many locales you support — and the list
   itself is one widget, so it scales from 2 to 200+ codes without
   dominating the layout.
2. **Styling control**. Native `<option>` elements are barely
   styleable; a `<ul role="listbox">` is ordinary markup. Endonyms in
   mixed scripts, per-option spacing, and the active-option indicator
   are all yours to style.
3. **The lifecycle is unchanged**. Swapping the control did not touch
   `lang` / `dir` application, RTL detection, persistence, navigator
   detection, `onChange`, or initial-value resolution.

It is a real trade, not a free upgrade. A native `<select>` gets
platform-level assistive-technology treatment, announces its value
while collapsed, and pops the OS picker on mobile; this control gets
none of that for free and reimplements the keyboard contract in JS.
[accessibility.md](./accessibility.md) sets out the three costs
honestly — the `aria-label`-only accessible name, the weaker
assistive-tech support, and the font-dependent, culturally-loaded
glyph.

For very long locale lists (50+), the built-in typeahead (type a label
prefix while the list is open) is the navigation affordance. See
[examples/all-locales.tsx](../examples/all-locales.tsx). An editable,
free-text combobox is out of scope — `children` replaces the glyph
only, so building one means composing a different primitive with this
package's exported pure helpers.

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
   and `.dir`. Click the button, click an option, and assert again.
3. **Controlled + onChange** — drive `value` programmatically and
   assert the same DOM observations.
4. **Interaction** — the keyboard contract is now the component's own
   code, so it needs its own tests: open keys, arrow clamping, Home /
   End, select, `Escape`, `Tab`, focus transfer, and typeahead.

See [../LocaleSelect.test.tsx](../LocaleSelect.test.tsx) for the
reference suite that covers every `spec/index.md` §7 acceptance item.

## Where this helper sits in Lily™

`LocaleSelect` is **not** part of the headless component catalog yet.
It lives in `lily-design-system-react-helpers/` as a sibling to
`ThemeSelect`. The two compose:

- `ThemeSelect` writes `data-theme` and a managed `<link>`.
- `LocaleSelect` writes `lang` and `dir`.

Both share the same icon-button-plus-listbox shape, the same
glyph-override `children` contract, the same `storageKey` /
controlled-value pattern, and the same no-hardcoded-strings rule — only
the glyph differs (`ThemeSelect` uses U+25D1 CIRCLE WITH RIGHT HALF
BLACK, `◑`). So they compose visually and semantically without
surprises, and one set of CSS rules styles both. Drop both at the top
of your layout and the two together cover the entire "visual
personalisation + linguistic personalisation" surface for a
public-sector or healthcare app.

---

Lily™ and Lily Design System™ are trademarks.
