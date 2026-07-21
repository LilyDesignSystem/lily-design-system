# Internationalisation principles (shared)

Adapted from the repo-root
[`AGENTS/internationalization.md`](../../../AGENTS/internationalization.md)
for the Nunjucks helpers catalog. Every helper in this catalog
follows these rules without exception.

- No hardcoded user-facing strings inside macros. Every label,
  description, placeholder, error message, action verb, and
  announcement is an `opts` key supplied by the consumer.
- Naming conventions for text-bearing opts keys are stable across
  helpers and frameworks: `label`, `description`, `placeholder`,
  `error`, `helpText`, `dismissLabel`, `loadingLabel`,
  `confirmLabel`, `cancelLabel`. New helpers reuse these names
  rather than inventing synonyms.
- Helpers that render dates, numbers, currencies, or measurements
  take the locale-relevant identifier (`currencyCode`, `locale`,
  etc.) as an `opts` key and either pass it through to `Intl.*`
  formatters or expose it via a `data-*` attribute so consumers can
  format. Helpers do not pick a default locale.
- Helpers that mark a region for screen-reader announcement
  (`Notification`, `Toast`, `Alert`, `SuperBanner`) accept the
  announced text and ARIA labels as `opts`; the role / `aria-live` /
  `aria-atomic` attributes are baked in but the content is always
  consumer-supplied.
- Anchors and links never embed default visible text. The content
  comes from the caller block or, for icon-only links, an explicit
  `label` opt that drives `aria-label`.
- Plural forms, gendered phrasing, and conditional copy are the
  consumer's concern. Helpers do not embed `count !== 1 ? "items"
  : "item"` logic; they accept the rendered string.
- Right-to-left and bidirectional text are inherited from the
  consumer's `dir` attribute and CSS — helpers do not assume LTR
  layout in their structural HTML. The `locale-chooser` helper goes
  one step further: its client.js auto-detects the script direction
  and writes `dir="rtl"` / `dir="ltr"` to the document root on
  every change.

## Nunjucks-specific notes

### Wiring an i18n library

The helpers don't depend on `i18next`, `gettext`,
`@11ty/eleventy-plugin-i18n`, or any other library. They expose:

- An `opts.value` and an `onChange` callback on the client.js so the
  consumer can both feed and receive the current selection.
- A `change` event on the root `<select>` (bubbles).

The locale-chooser also writes `<html lang>` and `<html dir>`, which
many i18n libraries read on initialisation; that integration usually
needs no extra wiring beyond an `autoInit({ onChange: setLocale })`.

### `Intl.DisplayNames`

The locale chooser doesn't use `Intl.DisplayNames` in the macro
(Nunjucks doesn't have a hook for it), but consumers can populate
`opts.localeLabels` with the output of `Intl.DisplayNames` in their
Eleventy data file:

```js
// _data/localeLabels.js
const dn = new Intl.DisplayNames(["en"], { type: "language" });
export default Object.fromEntries(
    ["en", "fr", "ar", "he", "ja"].map((c) => [c, dn.of(c) ?? c]),
);
```

```njk
{{ localeChooser({locales: [...], localeLabels: localeLabels}) }}
```

### Date / number / currency formatting

None of the current helpers format dates, numbers, or currencies.
When a future helper does, it accepts the locale as an opt and uses
`Intl.DateTimeFormat` / `Intl.NumberFormat` directly in the
client.js — no `day.js`, no `moment`, no `numeral`.

### Locale negotiation

The locale chooser's client.js implements a simple two-step
exact-then-prefix matcher in `matchNavigatorLanguage`. It does not
implement RFC 4647 best-fit lookup. If you need full RFC 4647
matching, run your own resolver
(`@formatjs/intl-localematcher`, `negotiator`) server-side and pass
the result as `opts.value`.

### `Accept-Language`

The catalog has no `Accept-Language` parsing helper because the
Nunjucks render itself doesn't see HTTP headers. Your host
(Eleventy edge function, Express, Workers) reads the header and
passes the result to the macro via `opts.value`. See
[`../ssr.md`](../ssr.md).

### What "i18n-clean" looks like in a test

```ts
const html = renderMacro({ label: "Langue", locales: ["en", "fr"] });
expect(html).toContain('aria-label="Langue"');
// The macro renders no other natural-language strings.
```

If a test ever needs to assert that an English word appears in the
markup, the helper has leaked a hardcoded string — fix the helper,
don't change the test.

## Eleventy i18n integration

[`@11ty/eleventy-plugin-i18n`](https://www.11ty.dev/docs/plugins/i18n/)
gives Eleventy a `locale_url` filter and locale-aware data
cascading. The Nunjucks locale-chooser pairs cleanly with it:

```njk
{# layouts/base.njk #}
<html lang="{{ lang | replace('_', '-') }}">
    <body>
        {% from "./locale-chooser.njk" import localeChooser %}
        {{ localeChooser({
            label: "Language",
            locales: ["en", "fr", "ar"],
            value: lang,
            storageKey: "lily-locale"
        }) }}
        …
    </body>
</html>
```

The select's `change` handler then needs to call
`window.location.href = locale_url(window.location.pathname, code)`
to navigate to the localised URL. See the locale-chooser's
`docs/i18n-integration.md` for the full Eleventy recipe.
