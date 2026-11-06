# Sverige Personnummer View

SverigePersonnummerView is a headless read-only display of Sweden's Personnummer, Sweden's national-id identifier. It renders as a `<span>`. It is the read-only companion to SverigePersonnummerInput.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

## Implementation Notes

- Renders as `<span>`, with no role
- Format: 12 digits in the format CCYYMMDDZZZQ: CCYYMMDD is the date of birth, ZZZ a serial (odd male, even female), and Q a Luhn check digit
- Provides accessible name via the `value` content
- Companion to SverigePersonnummerInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Personal Identity Number">
    <SverigePersonnummerView value="{value}" />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- No role, and no `aria-label`: a `<span>` cannot take a name, so `label` renders as hidden text in a `screen-reader-span`

## When to Use

- Use to display a stored Sweden Personnummer read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `sverige-personnummer-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.sverige-personnummer-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class, no role and no `aria-label`
- Verify the `value` prop is rendered as text content
- Verify `label` renders as hidden text, and that the root has no `aria-label`

## Domain Knowledge

National identification number issued by Skatteverket since 1947, twelve digits CCYYMMDDZZZQ in automated data (or ten digits when the century is implicit). CCYYMMDD is the date of birth, ZZZ is the individual serial number whose third digit is odd for males and even for females, and Q is a Luhn check digit.

**Where to find it:** Passports, national ID cards, driving licences, health-care cards, payslips, and tax correspondence; held by the Swedish Tax Agency (Skatteverket).

## Related components

- `sverige-personnummer-input` — an input for entering Sweden's Personnummer
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/Personal_identity_number_(Sweden)

---

Lily™ and Lily Design System™ are trademarks.
