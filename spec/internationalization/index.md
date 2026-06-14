# Internationalization

> Lily Design System specification — topic doc. All topics: [spec index](../index.md).

**Summary.** Lily headless components ship zero hardcoded user-facing strings: every label, message, and announcement is supplied by the consumer through stable prop names, and locale-specific formatting and bidi layout are the consumer's concern.

## Scope

This topic covers how user-facing text and locale behaviour move across the headless boundary: the no-hardcoded-strings rule, the stable text-prop name set, locale-aware formatting props, announced (live-region) text, link/anchor text, plural/gender/conditional copy, and right-to-left / bidirectional layout.

It explicitly does **not** cover: visual styling of text (see [theme](../theme/index.md)), the example apps' concrete English demo copy and `Intl.*` wiring (see [examples](../examples/index.md)), or the ARIA roles themselves (see [accessibility](../accessibility/index.md)). Lily does not bundle a translation library, message catalogue, or locale database.

## Principles and rules

- **No hardcoded user-facing strings inside components.** Every label, description, placeholder, error message, action verb, and announcement is a prop / parameter / slot supplied by the consumer.
- **Stable text-prop names across frameworks.** New components reuse the canonical names rather than inventing synonyms.
- **Locale-aware components take the locale identifier as a prop.** Components that render dates, numbers, currencies, or measurements accept the relevant identifier (`currencyCode`, `locale`, etc.) and either pass it through to `Intl.*` formatters or expose it via a `data-*` attribute. Components do not pick a default locale.
- **Announced regions accept their text as props.** Components that mark a region for screen-reader announcement (e.g. `Notification`, `Toast`, `Alert`, `SuperBanner`) accept the announced text and ARIA labels as props; the `role` / `aria-live` / `aria-atomic` attributes are baked in but the content is always consumer-supplied.
- **Anchors and links never embed default visible text.** Content comes from `children` (slot / `ChildContent`); icon-only links take an explicit `label` prop that drives `aria-label`.
- **Plural, gender, and conditional copy belong to the consumer.** Components do not embed `count !== 1 ? "items" : "item"` logic; they accept the already-rendered string.
- **RTL / bidi is inherited.** Right-to-left and bidirectional text are inherited from the consumer's `dir` attribute and CSS; components do not assume LTR layout in their structural HTML.

## Stable text-prop names

These names are reused across every framework. Prefer them over synonyms.

| Prop           | Purpose                                                        |
| -------------- | ------------------------------------------------------------- |
| `label`        | Accessible / visible name for a control or region.            |
| `description`  | Supporting descriptive text.                                  |
| `placeholder`  | Input placeholder text.                                       |
| `error`        | Validation / error message text.                              |
| `helpText`     | Inline help / hint text.                                      |
| `dismissLabel` | Accessible name for a dismiss / close affordance.             |
| `loadingLabel` | Announced text for a loading / busy state.                    |
| `confirmLabel` | Text for a confirm / primary action.                          |
| `cancelLabel`  | Text for a cancel / secondary action.                         |

## Locale-aware formatting

Locale-sensitive components take the identifier as a prop and never default it.

| Prop           | Example consumers                          | Typical use                               |
| -------------- | ------------------------------------------ | ----------------------------------------- |
| `locale`       | date, number, measurement components       | passed to `Intl.*` or exposed via `data-` |
| `currencyCode` | currency-input and related views           | passed to `Intl.NumberFormat`             |

```tsx
// Consumer supplies locale + currencyCode; component never assumes one.
<CurrencyInput
  label="Amount"
  locale="en-GB"
  currencyCode="GBP"
  value={amount}
  onChange={setAmount}
/>
```

The component either formats via `Intl.*` with the supplied identifier, or surfaces it as a `data-*` attribute (e.g. `data-currency-code`) so the consumer's CSS/JS can format and display.

## Announced regions

Live-region components own the ARIA plumbing but never the words.

| Concern                              | Owner    |
| ------------------------------------ | -------- |
| `role` / `aria-live` / `aria-atomic` | component |
| announced text content               | consumer |
| ARIA labels for the region           | consumer |

```tsx
// role + aria-live are baked in; the message text is a prop.
<Toast label="Saved" description="Your changes have been saved." />
```

## Links and anchors

```tsx
// Text link: content via children, never a baked-in default.
<BreadcrumbLink href="/">{homeText}</BreadcrumbLink>

// Icon-only link: explicit label drives aria-label.
<ActionLink href="/settings" label={settingsText} />
```

## Plurals, gender, conditional copy, and direction

- The consumer computes plural / gendered / conditional strings and passes the final string in. Components accept rendered text, not counts-plus-templates.
- Direction inherits from the consumer: set `dir="rtl"` (or `dir="auto"`) on an ancestor and the consumer's CSS handles mirroring. Component markup uses logical structure and does not assume LTR.

## Acceptance criteria

- [ ] No headless component contains a hardcoded user-facing string (label, description, placeholder, error, action verb, or announcement).
- [ ] Text-bearing props use the canonical names (`label`, `description`, `placeholder`, `error`, `helpText`, `dismissLabel`, `loadingLabel`, `confirmLabel`, `cancelLabel`) rather than synonyms.
- [ ] Locale-aware components accept `locale` / `currencyCode` (etc.) as props and pick no default locale.
- [ ] Live-region components bake in `role` / `aria-live` / `aria-atomic` but take announced text and ARIA labels as props.
- [ ] Anchors take visible text via `children`; icon-only links take an explicit `label` prop driving `aria-label`.
- [ ] No component embeds plural / gender / conditional copy logic.
- [ ] No component assumes LTR in its structural HTML; direction is left to the consumer's `dir` + CSS.

## Related topics

- [headless](../headless/index.md) — the zero-visual-decision boundary that strings cross via props
- [accessibility](../accessibility/index.md) — accessible names, live regions, and ARIA that text props feed
- [theme](../theme/index.md) — the parallel rule that visual tokens, like strings, live outside the headless layer
- [examples](../examples/index.md) — where concrete demo copy and `Intl.*` formatting are wired up

## Sources

- [AGENTS/internationalization.md](../../AGENTS/internationalization.md)
- [spec.md](../../spec.md) §4.3 Internationalisation
- [AGENTS/accessibility.md](../../AGENTS/accessibility.md)
