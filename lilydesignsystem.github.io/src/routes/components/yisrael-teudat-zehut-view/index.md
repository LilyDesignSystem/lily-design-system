# Yisrael Teudat Zehut View

YisraelTeudatZehutView is a headless read-only display of Israel's Teudat Zehut (תעודת זהות), Israel's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to YisraelTeudatZehutInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: Nine digits (left-padded with zeros when shorter), with the ninth a Luhn (Modulus-10) check digit: digits alternate between weights of 1 and 2 from the left, any doubled product over 9 has its own two digits summed, and the total must be a multiple of 10.
- Provides accessible name via the `label` prop
- Companion to YisraelTeudatZehutInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible label via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Teudat Zehut (תעודת זהות)">
    <YisraelTeudatZehutView label="Teudat Zehut (תעודת זהות)" value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `aria-label={label}` — provides the accessible name

## When to Use

- Use to display a stored Israel Teudat Zehut (תעודת זהות) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `yisrael-teudat-zehut-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.yisrael-teudat-zehut-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `aria-label` is set from the `label` prop

## Domain Knowledge

Nine digits (left-padded with zeros when shorter), with the ninth a Luhn (Modulus-10) check digit: digits alternate between weights of 1 and 2 from the left, any doubled product over 9 has its own two digits summed, and the total must be a multiple of 10.

**Where to find it:** Printed on the Teudat Zehut identity card and required to register with a Kupat Cholim (health fund) under Israel's National Health Insurance Law.

## Related components

- `yisrael-teudat-zehut-input` — an input for entering Israel's Teudat Zehut (תעודת זהות)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: [Israeli identity card](https://en.wikipedia.org/wiki/Israeli_identity_card)

---

Lily™ and Lily Design System™ are trademarks.
