# Internationalisation principles (shared)

Adapted from the repo-root
[`AGENTS/internationalization.md`](../../../AGENTS/internationalization.md)
for the Vue helpers catalog. Every helper in this catalog follows
these rules without exception.

- No hardcoded user-facing strings inside components. Every label,
  description, placeholder, error message, action verb, and
  announcement is a prop, parameter, or slot supplied by the
  consumer.
- Naming conventions for text-bearing props are stable across
  helpers and frameworks: `label`, `description`, `placeholder`,
  `error`, `helpText`, `dismissLabel`, `loadingLabel`,
  `confirmLabel`, `cancelLabel`. New helpers reuse these names
  rather than inventing synonyms.
- Helpers that render dates, numbers, currencies, or measurements
  take the locale-relevant identifier (`currencyCode`, `locale`,
  etc.) as a prop and either pass it through to `Intl.*` formatters
  or expose it via a `data-*` attribute so consumers can format.
  Helpers do not pick a default locale.
- Helpers that mark a region for screen-reader announcement
  (`Notification`, `Toast`, `Alert`, `SuperBanner`) accept the
  announced text and ARIA labels as props; the role / `aria-live` /
  `aria-atomic` attributes are baked in but the content is always
  consumer-supplied.
- Anchors and links never embed default visible text. The content
  comes from the default slot (`<slot />`) or, for icon-only links,
  an explicit `label` prop that drives `aria-label`.
- Plural forms, gendered phrasing, and conditional copy are the
  consumer's concern. Helpers do not embed `count !== 1 ? "items"
  : "item"` logic; they accept the rendered string.
- Right-to-left and bidirectional text are inherited from the
  consumer's `dir` attribute and CSS — helpers do not assume LTR
  layout in their structural HTML. The `locale-picker` helper goes
  one step further: it auto-detects the script direction and writes
  `dir="rtl"` / `dir="ltr"` to the document root on every change.

## Vue-specific notes

### Wiring an i18n library

The helpers don't depend on `vue-i18n`, `@nuxtjs/i18n`, Tolgee,
Paraglide, or any other library. They expose:

- A bindable `value` via `v-model:value` so the consumer's locale
  store can both feed and receive the current selection.
- A `change` event so the consumer can run side effects
  (load message bundles, refetch locale-dependent data, navigate to
  a localised URL).

The locale-picker also writes `<html lang>` and `<html dir>`, which
many i18n libraries read on initialisation; that integration usually
needs no extra wiring.

### `Intl.DisplayNames`

The locale picker uses `Intl.DisplayNames` opportunistically (third
fallback in `labelFor`). It never throws — calls are wrapped in a
try/catch so SSR and older environments degrade silently.

### Date / number / currency formatting

None of the current helpers format dates, numbers, or currencies.
When a future helper does, it accepts the locale as a prop and uses
`Intl.DateTimeFormat` / `Intl.NumberFormat` directly — no
`day.js`, no `moment`, no `numeral`.

### Locale negotiation

The locale picker implements a simple two-step exact-then-prefix
matcher in `matchNavigatorLanguage`. It does not implement RFC
4647 best-fit lookup. If you need full RFC 4647 matching, run your
own resolver (`@formatjs/intl-localematcher`, `negotiator`) and pass
the result as `value`.

### `Accept-Language`

The catalog has no `Accept-Language` parsing helper. Nuxt servers
read it via `getRequestHeader(event, "accept-language")`; see the
locale-picker's `docs/ssr.md` for the Nuxt recipe.

### What "i18n-clean" looks like in a test

```ts
const wrapper = mount(LocalePicker, {
    props: { label: "Langue", locales: ["en", "fr"] },
});
const fieldset = wrapper.find("fieldset");
expect(fieldset.attributes("aria-label")).toBe("Langue");
// The component renders no other natural-language strings.
```

If a test ever needs to assert that an English word appears in the
markup, the helper has leaked a hardcoded string — fix the helper,
don't change the test.
