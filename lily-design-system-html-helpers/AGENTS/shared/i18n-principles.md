# Internationalisation principles (shared)

Adapted from the repo-root
[`AGENTS/internationalization.md`](../../../AGENTS/internationalization.md)
for the HTML helpers catalog. Every helper in this catalog follows
these rules without exception.

- No hardcoded user-facing strings inside helpers. Every label,
  description, placeholder, error message, action verb, and
  announcement is an attribute or property supplied by the
  consumer.
- Naming conventions for text-bearing attributes are stable across
  helpers and frameworks: `label`, `description`, `placeholder`,
  `error`, `help-text`, `dismiss-label`, `loading-label`,
  `confirm-label`, `cancel-label`. New helpers reuse these names
  rather than inventing synonyms. (Kebab-case in attributes;
  camelCase in JS properties.)
- Helpers that render dates, numbers, currencies, or measurements
  take the locale-relevant identifier (`currency-code`, `locale`,
  etc.) as an attribute and either pass it through to `Intl.*`
  formatters or expose it via a `data-*` attribute so consumers can
  format. Helpers do not pick a default locale.
- Helpers that mark a region for screen-reader announcement
  (`Notification`, `Toast`, `Alert`, `SuperBanner`) accept the
  announced text and ARIA labels as attributes; the role /
  `aria-live` / `aria-atomic` attributes are baked in but the
  content is always consumer-supplied.
- Anchors and links never embed default visible text. The content
  comes from the host element's children or, for icon-only links,
  an explicit `label` attribute that drives `aria-label`.
- Plural forms, gendered phrasing, and conditional copy are the
  consumer's concern. Helpers do not embed `count !== 1 ? "items"
  : "item"` logic; they accept the rendered string.
- Right-to-left and bidirectional text are inherited from the
  consumer's `dir` attribute and CSS — helpers do not assume LTR
  layout in their structural HTML. The `locale-picker` helper goes
  one step further: it auto-detects the script direction and writes
  `dir="rtl"` / `dir="ltr"` to the document root on every change.

## Custom-element-specific notes

### Wiring an i18n library

The helpers don't depend on FormatJS, i18next, Polyglot, Paraglide,
or any other library. They expose:

- A read/write `value` attribute (and matching JS property) so the
  consumer's locale store can both feed and receive the current
  selection.
- A `localechange` `CustomEvent` (or `themechange` for the theme
  picker) so the consumer can run side effects (load message
  bundles, refetch locale-dependent data, navigate to a localised
  URL).

The locale picker also writes `<html lang>` and `<html dir>`, which
many i18n libraries read on initialisation; that integration
usually needs no extra wiring.

### `Intl.DisplayNames`

The locale picker uses `Intl.DisplayNames` opportunistically (third
fallback in `labelFor`). It never throws — calls are wrapped in a
try/catch so SSR (Node) and older environments degrade silently.

### Date / number / currency formatting

None of the current helpers format dates, numbers, or currencies.
When a future helper does, it accepts the locale as an attribute
and uses `Intl.DateTimeFormat` / `Intl.NumberFormat` directly — no
`day.js`, no `moment`, no `numeral`.

### Locale negotiation

The locale picker implements a simple two-step exact-then-prefix
matcher in `matchNavigatorLanguage`. It does not implement RFC
4647 best-fit lookup. If you need full RFC 4647 matching, run your
own resolver (`@formatjs/intl-localematcher`, `negotiator`) and pass
the result as the `value` attribute.

### `Accept-Language`

The catalog has no `Accept-Language` parsing helper. Static-site
generators read it via their own pipeline (Eleventy lacks a
request context; Astro and dynamic SSG hosts have one); see the
locale-picker's `docs/ssr.md` for recipes.

### What "i18n-clean" looks like in a test

```ts
const el = document.createElement("locale-picker");
el.setAttribute("label", "Langue");
el.setAttribute("locales", "en,fr");
document.body.appendChild(el);
const fs = el.querySelector("fieldset")!;
expect(fs.getAttribute("aria-label")).toBe("Langue");
// The component renders no other natural-language strings beyond
// the resolved labels for the locale codes.
```

If a test ever needs to assert that an English word appears in the
markup outside of `defaultLocaleLabels`, the helper has leaked a
hardcoded string — fix the helper, don't change the test.

### Kebab-case attribute names

The attribute form is always kebab-case (`storage-key`,
`detect-from-navigator`, `default-value`); the JS property is
always camelCase (`storageKey`, `detectFromNavigator`,
`defaultValue`). Both forms point at the same backing state.
