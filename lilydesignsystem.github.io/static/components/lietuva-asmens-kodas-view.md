# Lietuva Asmens Kodas View

LietuvaAsmensKodasView is a headless read-only display of Lithuania's Asmens kodas, Lithuania's national-id identifier. It renders as a `<span>`. It is the read-only companion to LietuvaAsmensKodasInput.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

## Implementation Notes

- Renders as `<span>`, with no role
- Format: 11 digits in the format GYYMMDDNNNC: G encodes sex and century (4 or 6 women, 3 or 5 men), YYMMDD is the date of birth, NNN is a serial, C is the check digit
- Provides accessible name via the `value` content
- Companion to LietuvaAsmensKodasInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Personal Code">
    <LietuvaAsmensKodasView value="{value}" />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- No role, and no `aria-label`: a `<span>` cannot take a name, so `label` renders as hidden text in a `screen-reader-span`

## When to Use

- Use to display a stored Lithuania Asmens kodas read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `lietuva-asmens-kodas-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.lietuva-asmens-kodas-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class, no role and no `aria-label`
- Verify the `value` prop is rendered as text content
- Verify `label` renders as hidden text, and that the root has no `aria-label`

## Domain Knowledge

Eleven digits in the form GYYMMDDNNNC: G encodes sex and century of birth (3/5 for men born in the 20th/21st century, 4/6 for women born in the 20th/21st century); YYMMDD is the date of birth; NNN is a serial number; and C is a Modulus-11 check digit.

**Where to find it:** Lithuanian ID card (Asmens tapatybės kortelė), passport, driving licence, residence permit, and most government correspondence.

## Security and privacy

A national identifier is personal data, and often a key to other records.

- The view shows exactly the text it is given; it does not mask. Pass the masked form (for example the last four characters) wherever the full number is not needed, and render the full number only to someone entitled to it.
- Do not log the value, put it in a URL or query string, or send it to analytics or an error tracker.
- Text on screen can be read over a shoulder and is kept by screenshots and screen recordings; treat a page that shows it as sensitive.

## Related components

- `lietuva-asmens-kodas-input` — an input for entering Lithuania's Asmens kodas
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Lithuania

---

Lily™ and Lily Design System™ are trademarks.
