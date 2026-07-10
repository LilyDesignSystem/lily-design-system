# Deutschland Krankenversichertennummer View

DeutschlandKrankenversichertennummerView is a headless read-only display of Germany's Krankenversichertennummer (KVNR), Germany's healthcare identifier. It renders as a `<span>` with `role="text"` so assistive technology announces the identifier as a single unit. It is the read-only companion to DeutschlandKrankenversichertennummerInput.

## Implementation Notes

- Renders as `<span>` with `role="text"`
- Format: a random capital letter followed by eight random digits and a Luhn check digit
- Provides accessible name via the `value` content
- Companion to DeutschlandKrankenversichertennummerInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — accessible label override via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Health Insurance Number">
    <DeutschlandKrankenversichertennummerView value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `role="text"` ensures the identifier is announced as a single unit

## When to Use

- Use to display a stored Germany Krankenversichertennummer (KVNR) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `deutschland-krankenversichertennummer-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.deutschland-krankenversichertennummer-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class and `role="text"`
- Verify the `value` prop is rendered as text content
- Verify `aria-label` overrides the accessible name when supplied

## Domain Knowledge

The Krankenversichertennummer (KVNR) is Germany's healthcare identifier. Format: a random capital letter followed by eight random digits and a Luhn check digit.

## Related components

- `deutschland-krankenversichertennummer-input` — an input for entering Germany's Krankenversichertennummer (KVNR)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://de.wikipedia.org/wiki/Krankenversichertennummer

---

Lily™ and Lily Design System™ are trademarks.
