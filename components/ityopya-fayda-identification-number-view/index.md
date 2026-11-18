# Ityopya Fayda Identification Number View

ItyopyaFaydaIdentificationNumberView is a headless read-only display of Ethiopia's Fayda Identification Number (FIN), Ethiopia's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to ItyopyaFaydaIdentificationNumberInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: Twelve digits issued by the National ID Program (NIDP). The number encodes no personal attributes and no check-digit algorithm is published, so only the length and digits can be checked. Do not confuse it with the six-digit Fayda alternative number used to link bank accounts.
- Provides accessible name via the `label` prop
- Companion to ItyopyaFaydaIdentificationNumberInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Fayda Identification Number (FIN)">
    <ItyopyaFaydaIdentificationNumberView
      label="Fayda Identification Number (FIN)"
      value="{value}"
    />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- No ARIA on the root: a plain `<span>` cannot be named. A visible caption names the value, or `label` renders as hidden text in a `.screen-reader-span`

## When to Use

- Use to display a stored Fayda Identification Number (FIN) from Ethiopia read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `ityopya-fayda-identification-number-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.ityopya-fayda-identification-number-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `label` renders as hidden text, and that the root has no `aria-label`

## Domain Knowledge

Twelve digits issued by the National ID Program (NIDP). The number encodes no personal attributes and no check-digit algorithm is published, so only the length and digits can be checked. Do not confuse it with the six-digit Fayda alternative number used to link bank accounts.

**Where to find it:** Sent by SMS when registration is complete, printed on the Fayda card, and asked for by banks and telecoms.

## Security and privacy

A national identifier is personal data, and often a key to other records.

- The view shows exactly the text it is given; it does not mask. Pass the masked form (for example the last four characters) wherever the full number is not needed, and render the full number only to someone entitled to it.
- Do not log the value, put it in a URL or query string, or send it to analytics or an error tracker.
- Text on screen can be read over a shoulder and is kept by screenshots and screen recordings; treat a page that shows it as sensitive.

## Related components

- `ityopya-fayda-identification-number-input` — an input for entering Ethiopia's Fayda Identification Number (FIN)
- `summary-list-item` — one key-value pair in a summary list

## References

- [Fayda ID](https://en.wikipedia.org/wiki/Fayda_ID)

---

Lily™ and Lily Design System™ are trademarks.
