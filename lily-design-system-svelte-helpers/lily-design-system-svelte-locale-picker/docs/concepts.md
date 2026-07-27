# Concepts

How `LocaleChooser` thinks about locale, where it sits in your stack,
and what it deliberately leaves to you.

## Three orthogonal concerns

A web app changes language across three independent axes:

| Axis                       | What changes                                               | Owner                                  |
| -------------------------- | ---------------------------------------------------------- | -------------------------------------- |
| **Document language**      | The `lang` attribute on `<html>`. Screen readers, search engines, hyphenation, font selection. | `LocaleChooser` (this helper).        |
| **Writing direction**      | The `dir` attribute on `<html>`. Bidi text, scrollbar position, flexbox/grid mirror. | `LocaleChooser` (auto-detected from the locale; opt out with `applyDir={false}`). |
| **Translated strings**     | The actual visible words on the page.                      | Your i18n library (`svelte-i18n`, Paraglide, Inlang, Tolgee, raw `Intl`). |

The helper owns the first two and signals the third via a bindable
`value`, a one-shot `onChange` callback, and the `lang` attribute (which
most i18n libraries don't read directly — they react to the bindable).

The split matters because it lets you swap your i18n library without
rewriting the select, and it lets the select stay headless: zero CSS,
zero string tables, zero dependencies beyond Svelte.

## What "headless" means here

The select:

- Renders an icon button plus a WAI-ARIA APG listbox — semantic HTML
  (`<button>`, `<ul>`, `<li>`) with the ARIA the pattern requires.
- Carries stable kebab-case class hooks (`locale-chooser` on the root
  `<div>`, plus `-button`, `-icon`, `-list`, `-option`) so your CSS can
  target it without prefixes or specificity tricks.
- Ships **no** colour, spacing, typography, font, icon, or animation
  decisions. You supply all of that — including, unavoidably, the
  **positioning CSS for the listbox**, without which the popup renders
  in normal document flow.
- Ships **no** translated strings. The `label` prop and `localeLabels`
  prop are passed through verbatim.

## The lifecycle

Each instance manages a single bindable `value`:

```
       ┌───────────────────────────────┐
       │   $effect — resolves once     │
       │                               │
   value (consumer) ─── if empty ───► storage ──► navigator ──► defaultValue ──► "en" ──► locales[0]
       │                               │
       │  writes back via bindable     │
       └───────────────────────────────┘
                       │
                       ▼
       ┌───────────────────────────────┐
       │   $effect — every value change│
       │                               │
       │   target.lang = BCP-47(value) │
       │   target.dir  = rtl|ltr       │
       │   localStorage.setItem(...)   │
       │   onChange(value)             │
       └───────────────────────────────┘
```

The effect is intentional — both DOM mutation and storage are side
effects, so they belong in `$effect`, not `$derived`.

## Why an icon button, not a native `<select>`

Two reasons:

1. **Constant width.** The closed control is one glyph wide whether
   you offer three locales or all 436 in `locales.tsv`. A native
   `<select>` is as wide as its longest option, or truncates it —
   awkward in the page header where a language switcher usually lives.
2. **Symmetry with `ThemeChooser`.** The sibling helper in this
   directory has the identical DOM shape, keyboard contract, and glyph
   treatment, so the two sit side by side in a header and read as one
   set. One block of CSS styles both.

Be clear about what this costs. A hand-rolled listbox has weaker
assistive-technology and mobile support than a native `<select>`, the
icon-only trigger puts the entire accessible name on `aria-label`, and
the glyph depends on the device's fonts. **For some audiences a native
`<select>` is genuinely the better choice.** All three tradeoffs, and
their mitigations, are in
[accessibility.md](./accessibility.md).

There is no longer an escape hatch to a different option rendering:
the `children` snippet replaces the button's **glyph**, not the
options, and its output lives inside a `<button>` so it cannot contain
interactive elements. If you need an always-visible list of locales,
read `value`, drive your own controls, and keep this package's exported
pure helpers for the logic. See
[custom-rendering.md](./custom-rendering.md).

## Why a separate `value` and `target.lang`

The bindable `value` is in **consumer form** — whatever you put into
`locales` (`en_US` or `en-US` or `en`). It round-trips losslessly.

The `target.lang` attribute is in **BCP 47 form** — always hyphens
(`en-US`). This is what `<html>` and HTML spec require.

Keeping them separate means:

- Your existing locale store (CLDR-style `en_US`) stays untouched.
- `<html lang>` is spec-compliant without consumer code touching the
  conversion.
- Two-way `bind:value` Just Works.

## Where storage fits in

`storageKey` is optional and opt-in. When set:

- Selection writes synchronously to `localStorage`.
- On a fresh mount with no `value` prop, the stored value is read back.
- Storage errors (private mode, quota) are swallowed silently; the
  select degrades to the default.

If you have a server (SvelteKit, Next + Svelte islands, etc.), prefer a
cookie instead — it survives the round-trip and avoids a flash of
default locale on first paint. Pass the cookie value as the initial
`value` prop. See [docs/ssr.md](./ssr.md).

## Where navigator detection fits in

`detectFromNavigator` is opt-in. When set, the first mount inspects
`navigator.languages` and picks the first entry whose language matches
something in your `locales` array. The match algorithm is simple
(exact first, language-only second) — not RFC 4647 best-fit. If you
need stronger negotiation, run your own resolver and pass the result
as `value`.

## How to test it

Three layers, mirroring the lifecycle:

1. **Pure helpers** — `bcp47LocaleTag`, `isRtlLocale`, `localeName`,
   `matchNavigatorLanguage` are pure functions. Unit-test them in
   isolation.
2. **DOM contract** — after mount, assert `document.documentElement.lang`
   and `.dir`. Then open the listbox (click the button) and click an
   option, and assert again. There is no `<select>` to fire `change`
   on.
3. **Bindable + onChange** — drive `value` programmatically and assert
   the same DOM observations.

A fourth layer sits alongside them: the **keyboard contract**, which
this component implements rather than inheriting. Open with a key on
the button, then send keys to the `<ul>` — focus moves there on open —
and assert `aria-activedescendant` rather than focus.

See [../LocaleChooser.test.ts](../LocaleChooser.test.ts) for the
reference suite covering every `spec/index.md` §7 acceptance clause.

---

Lily™ and Lily Design System™ are trademarks.
