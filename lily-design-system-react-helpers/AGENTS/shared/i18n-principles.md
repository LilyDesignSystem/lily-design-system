# Internationalisation principles (React adaptation)

This file adapts the cross-framework Lily i18n principles
(`../../../AGENTS/internationalization.md`) to React 19. All helpers
in this catalog follow these rules.

## The core rule

**No hardcoded user-facing strings inside components.**

Every label, description, placeholder, error message, action verb,
and announcement is a prop supplied by the consumer.

## Prop naming convention

Stable across frameworks and across helpers:

| Prop name         | Purpose                                                  |
| ----------------- | -------------------------------------------------------- |
| `label`           | Accessible name (radiogroup, dialog, region).            |
| `description`    | Supplementary descriptive text.                          |
| `placeholder`     | Input placeholder text.                                  |
| `error`           | Validation error string.                                 |
| `helpText`        | Help text shown alongside an input.                      |
| `dismissLabel`    | `aria-label` for a close / dismiss button.               |
| `loadingLabel`    | Announcement for a loading region.                       |
| `confirmLabel`    | Confirmation action button label.                        |
| `cancelLabel`     | Cancellation action button label.                        |
| `{x}Labels`       | Per-option label override map (e.g. `themeLabels`, `localeLabels`). |

New helpers reuse these names rather than inventing synonyms.

## Locale-aware formatting

Components that render dates, numbers, currencies, or measurements
take the locale-relevant identifier (`currencyCode`, `locale`,
etc.) as a prop and either pass it through to `Intl.*` formatters
or expose it via a data attribute so consumers can format. The
helpers do not pick a default locale.

`LocalePicker` is itself the producer of the locale; everything
else in the catalog (and downstream Lily components) consume it
via the `lang` attribute on `<html>`.

## Announcements

Components that mark a region for screen-reader announcement
(`Notification`, `Toast`, `Alert`, etc. in the headless library)
accept the announced text and ARIA labels as props. The role /
`aria-live` / `aria-atomic` attributes are baked in but the
content is always consumer-supplied.

The current React helper catalog has no live regions; the pickers
announce via native radio semantics.

## Anchors and links

Anchors and links never embed default visible text. The content
comes from `children` or, for icon-only links, an explicit `label`
prop that drives `aria-label`. Not applicable to the current
helpers but documented for future entries.

## Plural forms, gendered phrasing

Plural forms, gendered phrasing, and conditional copy are the
consumer's concern. Components do not embed
`count !== 1 ? "items" : "item"` logic; they accept the rendered
string.

## RTL / bidirectional text

Right-to-left and bidirectional text are inherited from the
consumer's `dir` attribute and CSS. `LocalePicker` writes
`dir="rtl"` or `dir="ltr"` to `<html>` based on the chosen locale
(see `../../lily-design-system-react-locale-picker/docs/rtl.md`).
Other helpers do not assume LTR layout.

## React-specific application

### Render-prop `children` for i18n flexibility

When the default markup is too rigid, the consumer can pass a
`children` render prop that receives a `labelFor(item)` resolver
plus the underlying state. They wrap or replace the default
markup with their own i18n strings.

```tsx
<ThemePicker label="主题" themesUrl="/t/" themes={["light", "dark"]}>
    {({ themes, value, setTheme, labelFor }) =>
        themes.map((t) => (
            <button
                key={t}
                aria-pressed={value === t}
                onClick={() => setTheme(t)}
            >
                {labelFor(t)}
            </button>
        ))
    }
</ThemePicker>
```

`labelFor` is the helper's resolution chain (override map → built-in
table → fallback). Consumers can replace it entirely by ignoring
`labelFor` and using their own function on the slugs.

### Server-resolved labels

For SEO and first-paint correctness, resolve labels on the server:

```tsx
// app/page.tsx — server component
import { getDictionary } from "./i18n";
import { LocaleChooser } from "./locale-chooser";

export default async function Page() {
    const t = await getDictionary("fr");
    return (
        <LocaleChooser
            label={t.languageLabel}
            localeLabels={{
                en: t.englishLabel,
                fr: t.frenchLabel,
                ar: t.arabicLabel,
            }}
        />
    );
}
```

`LocaleChooser` is a thin client wrapper around the helper. Server
data flows into client props; the i18n library runs server-side.

## When the helper "knows" English

Two cases where the React helpers ship default English text — both
intentional and overridable:

1. `LocalePicker`'s built-in `defaultLocaleLabels` table (in
   `locales.ts`, derived from `locales.tsv`). This is the
   English-name list — overridable per-locale via the
   `localeLabels` prop.
2. `ThemePicker`'s default `labelFor` title-cases the slug. This
   is a deterministic transformation, not a translation —
   overridable via the `themeLabels` prop.

In both cases, the helper never invents words. The behavior is
documented and predictable.

## Testing i18n

Each helper's test suite covers:

- The `label` prop appears as `aria-label` on the root.
- Per-option label override props win over the built-in table.
- Custom `children` render props receive the full state.
- No hardcoded English appears in the rendered output unless the
  consumer passes English.

The pickers do not ship a full i18n testing matrix (every locale
× every prop); the principle is that the helper never injects
strings, so testing one locale path covers all of them.

## See also

- Repo root `AGENTS/internationalization.md` — canonical
  cross-framework rules.
- `lily-design-system-react-locale-picker/docs/i18n-integration.md`
  — wiring react-intl, react-i18next, Paraglide, Tolgee.
- `lily-design-system-react-locale-picker/docs/bcp47.md` — BCP 47
  tag composition and `Intl.DisplayNames`.
