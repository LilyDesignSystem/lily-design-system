# Concepts

How `LocaleSelect` thinks about locale, where it sits in your stack,
and what it deliberately leaves to you.

This helper is a **macro + client.js pair**. The Nunjucks macro
renders deterministic HTML at template-render time; the companion
ES module wires the runtime lifecycle in the browser.

## Three orthogonal concerns

A web app changes language across three independent axes:

| Axis                       | What changes                                               | Owner                                  |
| -------------------------- | ---------------------------------------------------------- | -------------------------------------- |
| **Document language**      | The `lang` attribute on `<html>`. Screen readers, search engines, hyphenation, font selection. | `LocaleSelect` (this helper).        |
| **Writing direction**      | The `dir` attribute on `<html>`. Bidi text, scrollbar position, flexbox/grid mirror. | `LocaleSelect` (auto-detected from the locale; opt out with `applyDir: false`). |
| **Translated strings**     | The actual visible words on the page.                      | Your i18n library (eleventy-i18n, gettext via i18next-server, ICU MessageFormat, raw `Intl`). |

The helper owns the first two and signals the third via:

- The `onChange(code)` callback on `initLocaleSelect(root, opts)`,
- The `lang` attribute (which most i18n libraries don't read directly
  — they react to whatever store the `onChange` callback updates),
- The `<select>`'s current value (so a `<form>` submission also
  carries the chosen locale to the server).

The split matters because it lets you swap your i18n library without
rewriting the picker, and it lets the picker stay headless: zero CSS,
zero string tables, zero dependencies beyond Nunjucks server-side and
DOM APIs client-side.

## What "headless" means here

The picker:

- Renders semantic HTML (`<select>` + `<option>`) — a native combobox
  whose role and keyboard semantics the browser provides.
- Carries a stable kebab-case class hook (`locale-select` on the
  `<select>`, `locale-select-option` on each `<option>`) so your CSS
  can target it without prefixes or specificity tricks.
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
        {{ localeSelect(opts) }}    ──►   initLocaleSelect(root, opts)
                                          │
                                          ▼
                                          1. Read data-lily-* hooks
                                          2. Resolve initial code
                                             (selected > storage >
                                              navigator > default >
                                              "en" > first)
                                          3. target.lang = bcp47Tag(code)
                                          4. target.dir  = rtl|ltr
                                          5. localStorage.setItem(...)
                                          6. select.value sync
                                          7. opts.onChange(code)

                                          On every change event:
                                          ────────────────────────
                                          repeat 3–7 with new value
```

The macro **never** touches `document`, `navigator`, or
`localStorage`. The client.js **always** guards DOM access behind
`typeof document !== "undefined"` so it survives module evaluation
in Node (e.g. when the bundler tree-shakes).

## Why a native `<select>` by default

Three reasons:

1. **Scales**. A native `<select>` stays compact regardless of how
   many locales you list, and pops the OS-native picker on mobile.
2. **Symmetry with `ThemeSelect`**. The sibling helper in this
   directory uses the same shape, so the two compose visually and
   semantically without surprises.
3. **Escape hatch is one caller block away**. The macro's body is
   replaceable via a `{% call %}` block on a forked custom macro. See
   [examples/03-buttons.njk](../examples/03-buttons.njk) and
   [examples/10-combobox.njk](../examples/10-combobox.njk).

For an always-visible list of a few locales, use the caller block to
render a button group. See [examples/03-buttons.njk](../examples/03-buttons.njk).

## Why a separate `value` and `target.lang`

The consumer's locale code is in **consumer form** — whatever you
put into `locales` (`en_US` or `en-US` or `en`). It round-trips
losslessly through the `<option>`'s `value` attribute, the `onChange`
callback, and `localStorage`.

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
- On a fresh mount with no `value` opt (no `<option>` rendered
  `selected`), the stored value is read back.
- Storage errors (private mode, quota) are swallowed silently; the
  picker degrades to the navigator / default / `"en"` / first-option
  fallback chain.

If you have a Nunjucks-rendering server (Express, Eleventy, Astro,
Cloudflare Workers), prefer a cookie instead — it survives the
round-trip and avoids a flash of default locale on first paint.
Pass the cookie value as `opts.value` so the matching `<option>` is
rendered `selected` server-side. See [./ssr.md](./ssr.md).

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
   `locale-select.client.js`. Unit-test them in isolation; no DOM
   needed.
2. **Macro output** — `nunjucks.renderString(template, ctx)` and
   assert that the HTML contains the expected `<option>`s, hooks, and
   `selected` flag for the seeded `value`.
3. **DOM contract** — after rendering into jsdom and calling
   `initLocaleSelect(root)`, assert `document.documentElement.lang`
   and `.dir`. Drive a `change` on the `<select>` and assert again.

See [../locale-select.test.ts](../locale-select.test.ts) for the
reference suite that covers every `spec.md` §7 acceptance item.

## Symmetry with `ThemeSelect`

The sibling [`lily-design-system-nunjucks-theme-select`](../../lily-design-system-nunjucks-theme-select/)
ships with the same shape: a macro that emits a `<select>` with
`data-lily-*-root` hooks, and a client.js
that owns the apply lifecycle. Mount both pickers on the same page
to expose theme + language preferences side-by-side; they share
zero state and cannot collide.
