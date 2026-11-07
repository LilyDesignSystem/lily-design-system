# Taiwan Guomin Shenfenzheng Tongyi Bianhao View

TaiwanGuominShenfenzhengTongyiBianhaoView is a headless read-only display of Taiwan's National Identification Card Number, Taiwan's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to TaiwanGuominShenfenzhengTongyiBianhaoInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: One uppercase letter for the household-registration office, then nine digits. The first digit is 1 for a male and 2 for a female citizen (8 or 9 for a foreign resident), and the last digit is a check digit. The letter is converted to a two-digit number (A=10, B=11 and so on in the official order A-H, J-N, P-V, X, Y, W, Z, I, O), the eleven resulting digits are multiplied by the weights 1,9,8,7,6,5,4,3,2,1,1, and the sum must be a multiple of 10.
- Provides accessible name via the `label` prop
- Companion to TaiwanGuominShenfenzhengTongyiBianhaoInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="National Identification Card Number">
    <TaiwanGuominShenfenzhengTongyiBianhaoView
      label="National Identification Card Number"
      value="{value}"
    />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- No ARIA on the root: a plain `<span>` cannot be named. A visible caption names the value, or `label` renders as hidden text in a `.screen-reader-span`

## When to Use

- Use to display a stored Taiwan National Identification Card Number read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `taiwan-guomin-shenfenzheng-tongyi-bianhao-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.taiwan-guomin-shenfenzheng-tongyi-bianhao-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `label` renders as hidden text, and that the root has no `aria-label`

## Domain Knowledge

One uppercase letter for the household-registration office, then nine digits. The first digit is 1 for a male and 2 for a female citizen (8 or 9 for a foreign resident), and the last digit is a check digit. The letter is converted to a two-digit number (A=10, B=11 and so on in the official order A-H, J-N, P-V, X, Y, W, Z, I, O), the eleven resulting digits are multiplied by the weights 1,9,8,7,6,5,4,3,2,1,1, and the sum must be a multiple of 10.

**Where to find it:** Printed on the National Identification Card (國民身分證) and used for National Health Insurance, banking, tax filing and household registration.

## Security and privacy

A national identifier is personal data, and often a key to other records.

- The view shows exactly the text it is given; it does not mask. Pass the masked form (for example the last four characters) wherever the full number is not needed, and render the full number only to someone entitled to it.
- Do not log the value, put it in a URL or query string, or send it to analytics or an error tracker.
- Text on screen can be read over a shoulder and is kept by screenshots and screen recordings; treat a page that shows it as sensitive.

## Related components

- `taiwan-guomin-shenfenzheng-tongyi-bianhao-input` — an input for entering Taiwan's National Identification Card Number
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: [National identification card (Taiwan)](<https://en.wikipedia.org/wiki/National_identification_card_(Taiwan)>)

---

Lily™ and Lily Design System™ are trademarks.
