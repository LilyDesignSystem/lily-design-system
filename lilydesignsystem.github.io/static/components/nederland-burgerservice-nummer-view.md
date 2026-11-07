# Nederland Burgerservice Nummer View

NederlandBurgerserviceNummerView is a headless read-only display of Netherlands's Burgerservicenummer (BSN), Netherlands's national-id identifier. It renders as a `<span>`. It is the read-only companion to NederlandBurgerserviceNummerInput.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

## Implementation Notes

- Renders as `<span>`, with no role
- Format: 9-digit number issued via the Personal Records Database (BRP); validated with a variant of the eleven-test (Luhn) algorithm
- Provides accessible name via the `value` content
- Companion to NederlandBurgerserviceNummerInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Citizen Service Number">
    <NederlandBurgerserviceNummerView value="{value}" />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- No role, and no `aria-label`: a `<span>` cannot take a name, so `label` renders as hidden text in a `screen-reader-span`

## When to Use

- Use to display a stored Netherlands Burgerservicenummer (BSN) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `nederland-burgerservice-nummer-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.nederland-burgerservice-nummer-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class, no role and no `aria-label`
- Verify the `value` prop is rendered as text content
- Verify `label` renders as hidden text, and that the root has no `aria-label`

## Domain Knowledge

Nine-digit citizen service number issued through the Personal Records Database (Basisregistratie Personen, BRP); introduced in 2007, validated with a variant of the eleven-test (Luhn-style) algorithm, and required for all dealings with the Dutch government.

**Where to find it:** Dutch passport, identity card (Nederlandse identiteitskaart), driving licence, payslips, tax correspondence, and the DigiD-protected MijnOverheid portal.

## Related components

- `nederland-burgerservice-nummer-input` — an input for entering Netherlands's Burgerservicenummer (BSN)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/Burgerservicenummer

---

Lily™ and Lily Design System™ are trademarks.
