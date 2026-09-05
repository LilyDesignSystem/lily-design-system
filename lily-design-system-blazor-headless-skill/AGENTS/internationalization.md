## Internationalization design principles rules

- No hardcoded user-facing strings inside components. Every label, description, placeholder, error message, action verb, and announcement is a prop / parameter / slot supplied by the consumer.
- Naming conventions for text-bearing props are stable across frameworks: `label`, `description`, `placeholder`, `error`, `helpText`, `dismissLabel`, `loadingLabel`, `confirmLabel`, `cancelLabel`. New components reuse these names rather than inventing synonyms.
- Components that render dates, numbers, currencies, or measurements take the locale-relevant identifier (`currencyCode`, `locale`, etc.) as a prop and either pass it through to `Intl.*` formatters or expose it via a data attribute so consumers can format. Components do not pick a default locale.
- Components that mark a region for screen-reader announcement (e.g. `Notification`, `Toast`, `Alert`, `SuperBanner`) accept the announced text and ARIA labels as props; the role / `aria-live` / `aria-atomic` attributes are baked in but the content is always consumer-supplied.
- Anchors and links never embed default visible text. The content comes from `children` (slot / `ChildContent`) or, for icon-only links, an explicit `label` prop that drives `aria-label`.
- Plural forms, gendered phrasing, and conditional copy are the consumer's concern. Components do not embed `count !== 1 ? "items" : "item"` logic; they accept the rendered string.
- Right-to-left and bidirectional text are inherited from the consumer's `dir` attribute and CSS — components do not assume LTR layout in their structural HTML.
