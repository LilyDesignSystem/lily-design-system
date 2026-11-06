# Norge Fodselsnummer View

NorgeFodselsnummerView is a headless read-only display of Norway's Fødselsnummer, Norway's national-id identifier. It renders as a `<span>`. It is the read-only companion to NorgeFodselsnummerInput.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

## Implementation Notes

- Renders as `<span>`, with no role
- Format: 11 digits where the first 6 represent the date of birth (DDMMYY)
- Provides accessible name via the `value` content
- Companion to NorgeFodselsnummerInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Norwegian Birth Number">
    <NorgeFodselsnummerView value="{value}" />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- No role, and no `aria-label`: a `<span>` cannot take a name, so `label` renders as hidden text in a `screen-reader-span`

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

- Verify renders a `<span>` with the correct class, no role and no `aria-label`
- Verify the `value` prop is rendered as text content
- Verify `label` renders as hidden text, and that the root has no `aria-label`

## Domain Knowledge

Eleven digits where the first six are the date of birth (DDMMYY) and the next three are a personal/serial number — odd for males, even for females. The final two digits are check digits computed using a weighted Modulus-11.

**Where to find it:** Norwegian passport, national ID card, driving licence, bank cards, payslips, and the Altinn government portal.

## Related components

- `norge-fodselsnummer-input` — an input for entering Norway's Fødselsnummer
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Norway

---

Lily™ and Lily Design System™ are trademarks.
