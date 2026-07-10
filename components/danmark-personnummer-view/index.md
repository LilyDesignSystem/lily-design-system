# Danmark Personnummer View

DanmarkPersonnummerView is a headless read-only display of Denmark's Personnummer (CPR-nummer) (CPR), Denmark's national-id identifier. It renders as a `<span>` with `role="text"` so assistive technology announces the identifier as a single unit. It is the read-only companion to DanmarkPersonnummerInput.

## Implementation Notes

- Renders as `<span>` with `role="text"`
- Format: 10 digits in the format DDMMYYXXXX where the first 6 are the date of birth (DDMMYY)
- Provides accessible name via the `value` content
- Companion to DanmarkPersonnummerInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — accessible label override via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Personal Identity Code">
    <DanmarkPersonnummerView value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `role="text"` ensures the identifier is announced as a single unit

## When to Use

- Use to display a stored Denmark Personnummer (CPR-nummer) (CPR) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `danmark-personnummer-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.danmark-personnummer-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class and `role="text"`
- Verify the `value` prop is rendered as text content
- Verify `aria-label` overrides the accessible name when supplied

## Domain Knowledge

The Personnummer (CPR-nummer) (CPR) is Denmark's national-id identifier. Format: 10 digits in the format DDMMYYXXXX where the first 6 are the date of birth (DDMMYY).

## Related components

- `danmark-personnummer-input` — an input for entering Denmark's Personnummer (CPR-nummer) (CPR)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/Personal_identification_number_(Denmark)

---

Lily™ and Lily Design System™ are trademarks.
