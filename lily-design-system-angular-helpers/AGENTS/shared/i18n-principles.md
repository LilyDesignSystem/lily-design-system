# Internationalisation principles (shared)

Adapted from the repo-root
[`AGENTS/internationalization.md`](../../../AGENTS/internationalization.md)
for the Angular helpers catalog. Every helper in this catalog
follows these rules without exception.

- No hardcoded user-facing strings inside components. Every label,
  description, placeholder, error message, action verb, and
  announcement is an input, parameter, or content slot supplied by
  the consumer.
- Naming conventions for text-bearing inputs are stable across
  helpers and frameworks: `label`, `description`, `placeholder`,
  `error`, `helpText`, `dismissLabel`, `loadingLabel`,
  `confirmLabel`, `cancelLabel`. New helpers reuse these names
  rather than inventing synonyms.
- Helpers that render dates, numbers, currencies, or measurements
  take the locale-relevant identifier (`currencyCode`, `locale`,
  etc.) as an input and either pass it through to `Intl.*`
  formatters or expose it via a `data-*` attribute so consumers can
  format. Helpers do not pick a default locale.
- Helpers that mark a region for screen-reader announcement
  (`Notification`, `Toast`, `Alert`, `SuperBanner`) accept the
  announced text and ARIA labels as inputs; the role / `aria-live`
  / `aria-atomic` attributes are baked in but the content is
  always consumer-supplied.
- Anchors and links never embed default visible text. The content
  comes from `<ng-content>` projection or, for icon-only links, an
  explicit `label` input that drives `aria-label`.
- Plural forms, gendered phrasing, and conditional copy are the
  consumer's concern. Helpers do not embed `count !== 1 ?
  "items" : "item"` logic; they accept the rendered string.
- Right-to-left and bidirectional text are inherited from the
  consumer's `dir` attribute and CSS — helpers do not assume LTR
  layout in their structural HTML. The `locale-select` helper goes
  one step further: it auto-detects the script direction and writes
  `dir="rtl"` / `dir="ltr"` to the document root on every change.

## Angular-specific notes

### Wiring an i18n library

The helpers don't depend on `@angular/localize`, Transloco,
ngx-translate, or any other library. They expose:

- A bindable `value` via `[(value)]` so the consumer's locale
  store can both feed and receive the current selection.
- A `localeChange` / `themeChange` output so the consumer can run
  side effects (load message bundles, refetch locale-dependent
  data, navigate to a localised URL).

The locale-select also writes `<html lang>` and `<html dir>`, which
many i18n libraries read on initialisation; that integration
usually needs no extra wiring.

### `Intl.DisplayNames`

The locale picker uses `Intl.DisplayNames` opportunistically (third
fallback in `labelFor`). It never throws — calls are wrapped in a
try/catch so SSR and older environments degrade silently.

### Date / number / currency formatting

None of the current helpers format dates, numbers, or currencies.
When a future helper does, it accepts the locale as an input and
uses `Intl.DateTimeFormat` / `Intl.NumberFormat` directly — no
`day.js`, no `moment`, no `numeral`.

Angular's `DatePipe` / `CurrencyPipe` / `DecimalPipe` rely on the
`LOCALE_ID` injection token, which is global. Helpers must not
mutate `LOCALE_ID` — that's the consumer's choice. The helpers
write the `lang` attribute, which CSS `:lang()` selectors and
screen readers honour without touching `LOCALE_ID`.

### `@angular/localize`

`$localize` template literals from `@angular/localize` extract at
build time and substitute at runtime. The helpers never call
`$localize` because that would bake a default locale into the
binary. Consumers who use `@angular/localize` wrap the helper's
`label` input with their own `$localize`-marked strings:

```ts
@Component({
    template: `
        <lily-theme-select
            [label]="themeLabel"
            ...
        />
    `,
})
export class Settings {
    themeLabel = $localize`:@@settings.theme:Theme`;
}
```

### Locale negotiation

The locale picker implements a simple two-step exact-then-prefix
matcher in `matchNavigatorLanguage`. It does not implement RFC 4647
best-fit lookup. If you need full RFC 4647 matching, run your own
resolver (`@formatjs/intl-localematcher`, `negotiator`) and pass
the result as `value`.

### `Accept-Language`

The catalog has no `Accept-Language` parsing helper. Analog
servers read it via `getRequestHeader(event, "accept-language")`;
see the locale-select's `docs/ssr.md` for the Analog recipe.

### What "i18n-clean" looks like in a test

```ts
const fixture = mount({ label: "Langue", locales: ["en", "fr"] });
const select = fixture.nativeElement.querySelector("select");
expect(select.getAttribute("aria-label")).toBe("Langue");
// The component renders no other natural-language strings.
```

If a test ever needs to assert that an English word appears in the
markup, the helper has leaked a hardcoded string — fix the helper,
don't change the test.
