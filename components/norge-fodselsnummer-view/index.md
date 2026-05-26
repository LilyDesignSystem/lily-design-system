# Norge Fodselsnummer View

NorgeFodselsnummerView is a headless read-only display of Norway's Fødselsnummer, Norway's national-id identifier. It renders as a `<span>` with `role="text"` so assistive technology announces the identifier as a single unit. It is the read-only companion to NorgeFodselsnummerInput.

## Implementation Notes

- Renders as `<span>` with `role="text"`
- Format: 11 digits where the first 6 represent the date of birth (DDMMYY)
- Provides accessible name via the `value` content
- Companion to NorgeFodselsnummerInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — accessible label override via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Norwegian Birth Number">
    <NorgeFodselsnummerView value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `role="text"` ensures the identifier is announced as a single unit

## When to Use

- Use to display a stored Norway Fødselsnummer read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `norge-fodselsnummer-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.norge-fodselsnummer-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class and `role="text"`
- Verify the `value` prop is rendered as text content
- Verify `aria-label` overrides the accessible name when supplied

## Domain Knowledge

The Fødselsnummer is Norway's national-id identifier. Format: 11 digits where the first 6 represent the date of birth (DDMMYY).

## Related components

- `norge-fodselsnummer-input` — an input for entering Norway's Fødselsnummer
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Norway
