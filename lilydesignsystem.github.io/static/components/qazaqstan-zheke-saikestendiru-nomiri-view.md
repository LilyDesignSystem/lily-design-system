# Qazaqstan Zheke Saikestendiru Nomiri View

QazaqstanZhekeSaikestendiruNomiriView is a headless read-only display of Kazakhstan's Individual Identification Number (IIN), Kazakhstan's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to QazaqstanZhekeSaikestendiruNomiriInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: Twelve digits: the date of birth as YYMMDD, a digit for century and sex, a four-digit serial and a check digit. The check digit is the sum of the first eleven digits times the weights 1 to 11, modulo 11; if that is 10, repeat with the weights 3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 2, and if it is 10 again the number is not issued.
- Provides accessible name via the `label` prop
- Companion to QazaqstanZhekeSaikestendiruNomiriInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Individual Identification Number (IIN)">
    <QazaqstanZhekeSaikestendiruNomiriView
      label="Individual Identification Number (IIN)"
      value="{value}"
    />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- No ARIA on the root: a plain `<span>` cannot be named. A visible caption names the value, or `label` renders as hidden text in a `.screen-reader-span`

## When to Use

- Use to display a stored Individual Identification Number (IIN) from Kazakhstan read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `qazaqstan-zheke-saikestendiru-nomiri-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.qazaqstan-zheke-saikestendiru-nomiri-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `label` renders as hidden text, and that the root has no `aria-label`

## Domain Knowledge

Twelve digits: the date of birth as YYMMDD, a digit for century and sex, a four-digit serial and a check digit. The check digit is the sum of the first eleven digits times the weights 1 to 11, modulo 11; if that is 10, repeat with the weights 3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 2, and if it is 10 again the number is not issued.

**Where to find it:** Printed on the identity card and passport, and used as the personal tax number and in every eGov service.

## Security and privacy

A national identifier is personal data, and often a key to other records.

- The view shows exactly the text it is given; it does not mask. Pass the masked form (for example the last four characters) wherever the full number is not needed, and render the full number only to someone entitled to it.
- Do not log the value, put it in a URL or query string, or send it to analytics or an error tracker.
- Text on screen can be read over a shoulder and is kept by screenshots and screen recordings; treat a page that shows it as sensitive.

## Related components

- `qazaqstan-zheke-saikestendiru-nomiri-input` — an input for entering Kazakhstan's Individual Identification Number (IIN)
- `summary-list-item` — one key-value pair in a summary list

## References

- [OECD: Kazakhstan TIN](https://www.oecd.org/tax/automatic-exchange/crs-implementation-and-assistance/tax-identification-numbers/Kazakhstan-TIN.pdf)
- [eGov.kz: Individual identification number](https://egov.kz/cms/en/articles/iin_info)

---

Lily™ and Lily Design System™ are trademarks.
