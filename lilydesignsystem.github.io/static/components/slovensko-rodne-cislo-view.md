# Slovensko Rodne Cislo View

SlovenskoRodneCisloView is a headless read-only display of Slovakia's Rodné číslo (RČ), Slovakia's national-id identifier. It renders as a `<span>`. It is the read-only companion to SlovenskoRodneCisloInput.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

## Implementation Notes

- Renders as `<span>`, with no role
- Format: 10 digits in the form YYMMDDCCCX where MM is 01-12 for males and 51-62 for females; X is a check digit and the whole number is divisible by 11
- Provides accessible name via the `value` content
- Companion to SlovenskoRodneCisloInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Slovak Personal Number">
    <SlovenskoRodneCisloView value="{value}" />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- No role, and no `aria-label`: a `<span>` cannot take a name, so `label` renders as hidden text in a `screen-reader-span`

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

- Verify renders a `<span>` with the correct class, no role and no `aria-label`
- Verify the `value` prop is rendered as text content
- Verify `label` renders as hidden text, and that the root has no `aria-label`

## Domain Knowledge

Ten-digit code in the form YYMMDDCCCX: the first six digits are the date of birth (with month offset of +50 for women, so MM is 01–12 for men and 51–62 for women), CCC is a serial number distinguishing persons born on the same date, and X is a check digit such that the entire number is divisible by 11.

**Where to find it:** Birth certificate (rodný list), national ID card (občiansky preukaz), driving licence, and other personal documents.

## Security and privacy

A national identifier is personal data, and often a key to other records.

- The view shows exactly the text it is given; it does not mask. Pass the masked form (for example the last four characters) wherever the full number is not needed, and render the full number only to someone entitled to it.
- Do not log the value, put it in a URL or query string, or send it to analytics or an error tracker.
- Text on screen can be read over a shoulder and is kept by screenshots and screen recordings; treat a page that shows it as sensitive.

## Related components

- `slovensko-rodne-cislo-input` — an input for entering Slovakia's Rodné číslo (RČ)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Slovakia

---

Lily™ and Lily Design System™ are trademarks.
