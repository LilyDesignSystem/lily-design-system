# Costa Rica Cedula De Identidad View

CostaRicaCedulaDeIdentidadView is a headless read-only display of Costa Rica's Cédula de Identidad, Costa Rica's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to CostaRicaCedulaDeIdentidadInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: A province digit, a volume (tomo) of up to four digits and an entry (asiento) of up to four digits, written P-TTTT-AAAA (1-0613-0584) and often stored as nine or ten digits with the leading zeroes padded. It has no check digit, so only the parts and their lengths can be checked.
- Provides accessible name via the `label` prop
- Companion to CostaRicaCedulaDeIdentidadInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Cédula de Identidad">
    <CostaRicaCedulaDeIdentidadView
      label="Cédula de Identidad"
      value="{value}"
    />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- No ARIA on the root: a plain `<span>` cannot be named. A visible caption names the value, or `label` renders as hidden text in a `.screen-reader-span`

## When to Use

- Use to display a stored Cédula de Identidad from Costa Rica read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `costa-rica-cedula-de-identidad-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.costa-rica-cedula-de-identidad-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `label` renders as hidden text, and that the root has no `aria-label`

## Domain Knowledge

A province digit, a volume (tomo) of up to four digits and an entry (asiento) of up to four digits, written P-TTTT-AAAA (1-0613-0584) and often stored as nine or ten digits with the leading zeroes padded. It has no check digit, so only the parts and their lengths can be checked.

**Where to find it:** Printed on the cédula issued by the Tribunal Supremo de Elecciones, and used for tax, banking and health services.

## Security and privacy

A national identifier is personal data, and often a key to other records.

- The view shows exactly the text it is given; it does not mask. Pass the masked form (for example the last four characters) wherever the full number is not needed, and render the full number only to someone entitled to it.
- Do not log the value, put it in a URL or query string, or send it to analytics or an error tracker.
- Text on screen can be read over a shoulder and is kept by screenshots and screen recordings; treat a page that shows it as sensitive.

## Related components

- `costa-rica-cedula-de-identidad-input` — an input for entering Costa Rica's Cédula de Identidad
- `summary-list-item` — one key-value pair in a summary list

## References

- [Cédula de identidad (Costa Rica)](<https://es.wikipedia.org/wiki/C%C3%A9dula_de_identidad_(Costa_Rica)>)
- [python-stdnum: stdnum.cr.cpf](https://arthurdejong.org/python-stdnum/doc/2.2/stdnum.cr.cpf)

---

Lily™ and Lily Design System™ are trademarks.
