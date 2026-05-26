# Slovensko Rodne Cislo View

SlovenskoRodneCisloView is a headless read-only display of Slovakia's Rodné číslo (RČ), Slovakia's national-id identifier. It renders as a `<span>` with `role="text"` so assistive technology announces the identifier as a single unit. It is the read-only companion to SlovenskoRodneCisloInput.

## Implementation Notes

- Renders as `<span>` with `role="text"`
- Format: 10 digits in the form YYMMDDCCCX where MM is 01-12 for males and 51-62 for females; X is a check digit and the whole number is divisible by 11
- Provides accessible name via the `value` content
- Companion to SlovenskoRodneCisloInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — accessible label override via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Slovak Personal Number">
    <SlovenskoRodneCisloView value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `role="text"` ensures the identifier is announced as a single unit

## When to Use

- Use to display a stored Slovakia Rodné číslo (RČ) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `slovensko-rodne-cislo-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.slovensko-rodne-cislo-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class and `role="text"`
- Verify the `value` prop is rendered as text content
- Verify `aria-label` overrides the accessible name when supplied

## Domain Knowledge

The Rodné číslo (RČ) is Slovakia's national-id identifier. Format: 10 digits in the form YYMMDDCCCX where MM is 01-12 for males and 51-62 for females; X is a check digit and the whole number is divisible by 11.

## Related components

- `slovensko-rodne-cislo-input` — an input for entering Slovakia's Rodné číslo (RČ)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Slovakia
