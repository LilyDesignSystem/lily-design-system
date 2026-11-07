# IBAN View

IbanView is a headless read-only display of an International Bank Account Number (IBAN), used for bank accounts in many countries. It renders as a `<span>`. It is the read-only companion to IbanInput.

**Status:** experimental — new, implemented and unit-tested in every headless library; not yet exercised in composed flows.

## Implementation Notes

- Renders as `<span>`, with no role
- Format: Up to 34 letters and digits: a two-letter country code, two check digits, then the national account number
- Provides accessible name via the `value` content
- Companion to IbanInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="IBAN">
    <IbanView value="{value}" />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- No role, and no `aria-label`: a `<span>` cannot take a name, so `label` renders as hidden text in a `screen-reader-span`

## When to Use

- Use to display a stored IBAN read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `iban-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for an account format with no IBAN — show it with `text-input` or plain text.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.iban-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class, no role and no `aria-label`
- Verify the `value` prop is rendered as text content
- Verify `label` renders as hidden text, and that the root has no `aria-label`

## Domain Knowledge

The International Bank Account Number is defined by ISO 13616, with SWIFT as its registrar. It has up to 34 letters and digits: a two-letter ISO 3166-1 country code, two check digits, then the Basic Bank Account Number, whose length and format each country sets. Print it in groups of four, as in `GB82 WEST 1234 5698 7654 32`; store and send it with no spaces.

**Check digits.** ISO 7064 Mod 97-10: remove spaces, move the first four characters to the end, replace each letter with two digits (A = 10 to Z = 35), and the whole number modulo 97 must equal 1. A pass shows the number is well formed, not that the account exists. This component ships no validation; the consumer runs the check.

**Where it is used.** Across Europe and in many countries of the Middle East, Africa and Latin America. It is not universal: the United States, Canada, Australia and China, among others, do not use it. Offer such users their own account format.

**Where to find it:** Bank statements, online banking and invoices.

## Related components

- `iban-input` — an input for entering an International Bank Account Number (IBAN)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/International_Bank_Account_Number

---

Lily™ and Lily Design System™ are trademarks.
