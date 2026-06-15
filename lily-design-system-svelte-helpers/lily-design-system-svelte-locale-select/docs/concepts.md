# Concepts

How `LocaleSelect` thinks about locale, where it sits in your stack,
and what it deliberately leaves to you.

## Three orthogonal concerns

A web app changes language across three independent axes:

| Axis                       | What changes                                               | Owner                                  |
| -------------------------- | ---------------------------------------------------------- | -------------------------------------- |
| **Document language**      | The `lang` attribute on `<html>`. Screen readers, search engines, hyphenation, font selection. | `LocaleSelect` (this helper).        |
| **Writing direction**      | The `dir` attribute on `<html>`. Bidi text, scrollbar position, flexbox/grid mirror. | `LocaleSelect` (auto-detected from the locale; opt out with `applyDir={false}`). |
| **Translated strings**     | The actual visible words on the page.                      | Your i18n library (`svelte-i18n`, Paraglide, Inlang, Tolgee, raw `Intl`). |

The helper owns the first two and signals the third via a bindable
`value`, a one-shot `onChange` callback, and the `lang` attribute (which
most i18n libraries don't read directly — they react to the bindable).

The split matters because it lets you swap your i18n library without
rewriting the picker, and it lets the picker stay headless: zero CSS,
zero string tables, zero dependencies beyond Svelte.

## What "headless" means here

The picker:

- Renders semantic HTML (`<fieldset>` + `<input type="radio">`) with
  exactly the ARIA the WAI-ARIA APG specifies for a radio group.
- Carries a stable kebab-case class hook (`locale-select`,
  `locale-select-option`, `locale-select-option-label`) on every
  element so your CSS can target it without prefixes or specificity
  tricks.
- Ships **no** colour, spacing, typography, font, icon, or animation
  decisions. You supply all of that.
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

## Why `<fieldset role="radiogroup">` by default

Three reasons:

1. **Discoverability**. The full set of options surfaces to assistive
   tech on first focus into the group, while a `<select>` requires the
   user to open the popover before the choices are announced.
2. **Symmetry with `ThemeSelect`**. The sibling helper in this
   directory uses the same shape, so the two compose visually and
   semantically without surprises.
3. **Escape hatch is one snippet away**. The `children` snippet hands
   you the full state machine — locales, value, `setLocale`, `tagFor`,
   `isRtl`, `labelFor` — so a `<select>` or button group is a 10-line
   rewrite, not a fork.

For long locale lists (>~12), use the children snippet to render a
`<select>` or combobox. See [examples/02-select.svelte](../examples/02-select.svelte).

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
  picker degrades to the default.

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
   and `.dir`. Drive a `click` to a radio and assert again.
3. **Bindable + onChange** — drive `value` programmatically and assert
   the same DOM observations.

See [../LocaleSelect.test.ts](../LocaleSelect.test.ts) for the
30-case reference suite that covers every `spec.md` §7 acceptance item.
