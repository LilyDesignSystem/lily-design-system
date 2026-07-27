# Concepts

How `LocaleChooser` thinks about locale, where it sits in your stack,
and what it deliberately leaves to you.

This helper is a **macro + client.js pair**. The Nunjucks macro
renders deterministic HTML at template-render time; the companion
ES module wires the runtime lifecycle in the browser.

## Three orthogonal concerns

A web app changes language across three independent axes:

| Axis                       | What changes                                               | Owner                                  |
| -------------------------- | ---------------------------------------------------------- | -------------------------------------- |
| **Document language**      | The `lang` attribute on `<html>`. Screen readers, search engines, hyphenation, font selection. | `LocaleChooser` (this helper).        |
| **Writing direction**      | The `dir` attribute on `<html>`. Bidi text, scrollbar position, flexbox/grid mirror. | `LocaleChooser` (auto-detected from the locale; opt out with `applyDir: false`). |
| **Translated strings**     | The actual visible words on the page.                      | Your i18n library (eleventy-i18n, gettext via i18next-server, ICU MessageFormat, raw `Intl`). |

The helper owns the first two and signals the third via:

- The `onChange(code)` callback on `initLocaleChooser(root, opts)`,
- The `lang` attribute (which most i18n libraries don't read directly
  — they react to whatever store the `onChange` callback updates),
- The hidden input's value (so a `<form>` submission also carries the
  chosen locale to the server).

The split matters because it lets you swap your i18n library without
rewriting the select, and it lets the select stay headless: zero CSS,
zero string tables, zero dependencies beyond Nunjucks server-side and
DOM APIs client-side.

## What "headless" means here

The select:

- Renders semantic HTML — a `<button>` trigger and a
  `<ul role="listbox">` of `<li role="option">` choices, following
  the WAI-ARIA APG listbox pattern.
- Carries a stable kebab-case class hook (`locale-chooser` on the root
  `<div>`, `locale-chooser-button` on the trigger,
  `locale-chooser-icon` on the default glyph, `locale-chooser-list` on
  the listbox, `locale-chooser-option` on each option) so your CSS can
  target it without prefixes or specificity tricks. See
  [styling.md](./styling.md).
- Ships **no** colour, spacing, typography, font, icon, or animation
  decisions. You supply all of that.
- Ships **no** translated strings. The `label` opt and `localeLabels`
  opt are passed through verbatim into the rendered HTML.
- Ships **no** inline `<script>` or `<style>` blocks. The client.js
  is a separate ES module the consumer loads exactly once.

## The macro is pure; the client.js does the rest

Conceptually:

```
        Nunjucks render time              Browser run time
        ─────────────────────             ──────────────────
        {{ localeChooser(opts) }}    ──►   initLocaleChooser(root, opts)
                                          │
                                          ▼
                                          1. Read data-lily-* hooks
                                          2. Wire button + listbox
                                             (open/close, keys, typeahead)
                                          3. Resolve initial code
                                             (value attr > storage >
                                              navigator > default >
                                              "en" > first)
                                          4. target.lang = bcp47Tag(code)
                                          5. target.dir  = rtl|ltr
                                          6. localStorage.setItem(...)
                                          7. hidden input + aria-selected
                                          8. opts.onChange(code)

                                          On every committed choice:
                                          ────────────────────────
                                          repeat 4–8 with new value
```

The macro **never** touches `document`, `navigator`, or
`localStorage`. The client.js **always** guards DOM access behind
`typeof document !== "undefined"` so it survives module evaluation
in Node (e.g. when the bundler tree-shakes).

The corollary is the honest one: **the macro's output is inert until
the client module runs.** The button opens nothing without JS. That
is a real regression from the earlier native `<select>`, which the
browser drove unaided. The hidden input is pre-filled server-side, so
a no-JS form submit still carries a locale — that is the only no-JS
affordance the control has.

## Why an icon button and a listbox

Three reasons:

1. **Constant width**. The trigger shows a globe glyph
   (U+1F310 GLOBE WITH MERIDIANS), never a locale name, so the
   control does not resize as the active locale changes and does not
   reserve width for your longest label.
2. **Symmetry with `ThemeChooser`**. The sibling helper in this
   directory uses the same shape, so the two compose visually and
   semantically without surprises.
3. **Full styling control**. A native `<select>`'s popup is drawn by
   the OS and barely styleable; a `<ul role="listbox">` is ordinary
   DOM your CSS owns completely.

The costs are stated where they belong:
[accessibility.md](./accessibility.md) for the announcement tradeoff
(the closed control never shows the active locale) and
[ssr.md](./ssr.md) for the no-JS regression.

## Custom rendering

Two escape hatches, in order of effort:

1. **The `{% call %}` block** replaces the default glyph *inside the
   button* with the block body — Nunjucks's equivalent of "children".
   It does not render options; the listbox still comes from
   `opts.locales`. Keep the replacement `aria-hidden="true"`, since
   the button's accessible name is its `aria-label`. See
   [examples/03-custom-rendering.njk](../examples/03-custom-rendering.njk) and
   [examples/localeChooserCustom.njk](../examples/localeChooserCustom.njk).
2. **Hand-written markup**, when you need a control the macro cannot
   render at all. `initLocaleChooser(root)` works against any DOM that
   supplies `data-lily-locale-chooser-root`, `-button`, `-list`, and
   optionally `-input`, with `role="option"` + `data-value` on each
   choice. Miss the button or the list and the call returns an inert
   controller.

For an always-visible list of a few locales, neither hatch is the
right tool — render plain links or submit buttons, which keep working
with script off.

## Why a separate `value` and `target.lang`

The consumer's locale code is in **consumer form** — whatever you
put into `locales` (`en_US` or `en-US` or `en`). It round-trips
losslessly through the option's `data-value` attribute, the hidden
input's value, the `onChange` callback, and `localStorage`.

The `target.lang` attribute is in **BCP 47 form** — always hyphens
(`en-US`). This is what `<html>` and the HTML spec require.

Keeping them separate means:

- Your existing locale store (CLDR-style `en_US`) stays untouched.
- `<html lang>` is spec-compliant without consumer code touching the
  conversion.
- A submitted `<form>` carries the original `en_US`, but the
  `Accept-Language`-aware server sees the normalised form via
  `request.headers["accept-language"]` if you've also wired the
  cookie / URL strategy from [./ssr.md](./ssr.md).

## Where storage fits in

`storageKey` is optional and opt-in. When set:

- The client.js writes synchronously to `localStorage` on every
  apply.
- On a fresh mount with no `value` opt (no
  `data-lily-locale-chooser-value` attribute), the stored value is read
  back.
- Storage errors (private mode, quota) are swallowed silently; the
  select degrades to the navigator / default / `"en"` / first-option
  fallback chain.

If you have a Nunjucks-rendering server (Express, Eleventy, Astro,
Cloudflare Workers), prefer a cookie instead — it survives the
round-trip and avoids a flash of default locale on first paint.
Pass the cookie value as `opts.value`, which the macro serialises as
`data-lily-locale-chooser-value` server-side. See [./ssr.md](./ssr.md).

## Where navigator detection fits in

`detectFromNavigator` is opt-in. When set, the first mount inspects
`navigator.languages` (falling back to `navigator.language`) and
picks the first entry whose language matches something in your
`locales` array. The match algorithm is simple:

1. Exact match (treating `-` and `_` as equivalent).
2. Language-only match (`fr-CA` navigator preference → `fr` locale).

This is not RFC 4647 best-fit. If you need stronger negotiation,
run your own resolver server-side (see [./i18n-integration.md](./i18n-integration.md))
and pass the result as `opts.value`.

## How to test it

Three layers, mirroring the lifecycle:

1. **Pure helpers** — `bcp47LocaleTag`, `isRtlLocale`, `localeName`,
   `matchNavigatorLanguage` are pure functions exported from
   `locale-chooser.client.js`. Unit-test them in isolation; no DOM
   needed.
2. **Macro output** — `nunjucks.renderString(template, ctx)` and
   assert that the HTML contains the expected `<li role="option">`s,
   hooks, and `data-lily-locale-chooser-value` for the seeded `value`
   — and that the listbox renders `hidden` with exactly one option
   `aria-selected="true"` and the hidden input pre-filled.
3. **DOM contract** — after rendering into jsdom and calling
   `initLocaleChooser(root)`, assert `document.documentElement.lang`
   and `.dir`. Then drive the control the way a user would — open the
   listbox from the button, move with the arrow keys, commit with
   Enter or a click — and assert again.

See [../locale-chooser.test.ts](../locale-chooser.test.ts) for the
reference suite that covers every `spec/index.md` §7 acceptance item.

## Symmetry with `ThemeChooser`

The sibling [`lily-design-system-nunjucks-theme-chooser`](../../lily-design-system-nunjucks-theme-chooser/)
ships with the same shape: a macro that emits markup with
`data-lily-*-root` hooks, and a client.js
that owns the apply lifecycle. Mount both selects on the same page
to expose theme + language preferences side-by-side; they share
zero state and cannot collide.

---

Lily™ and Lily Design System™ are trademarks.
