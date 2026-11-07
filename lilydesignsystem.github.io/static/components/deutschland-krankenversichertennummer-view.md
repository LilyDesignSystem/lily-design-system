# Deutschland Krankenversichertennummer View

DeutschlandKrankenversichertennummerView is a headless read-only display of Germany's Krankenversichertennummer (KVNR), Germany's healthcare identifier. It renders as a `<span>`. It is the read-only companion to DeutschlandKrankenversichertennummerInput.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

## Implementation Notes

- Renders as `<span>`, with no role
- Format: a random capital letter followed by eight random digits and a Luhn check digit
- Provides accessible name via the `value` content
- Companion to DeutschlandKrankenversichertennummerInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Health Insurance Number">
    <DeutschlandKrankenversichertennummerView value="{value}" />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- No role, and no `aria-label`: a `<span>` cannot take a name, so `label` renders as hidden text in a `screen-reader-span`

## When to Use

- Use to display a stored Germany Krankenversichertennummer (KVNR) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `deutschland-krankenversichertennummer-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.deutschland-krankenversichertennummer-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class, no role and no `aria-label`
- Verify the `value` prop is rendered as text content
- Verify `label` renders as hidden text, and that the root has no `aria-label`

## Domain Knowledge

Lifelong federal health-insurance identifier: one random uppercase letter followed by eight random digits and a Luhn check digit, carried on the electronic health card (elektronische Gesundheitskarte, eGK).

**Where to find it:** German electronic health insurance card (eGK), insurer correspondence, and prescriptions.

## Related components

- `deutschland-krankenversichertennummer-input` — an input for entering Germany's Krankenversichertennummer (KVNR)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://de.wikipedia.org/wiki/Krankenversichertennummer

---

Lily™ and Lily Design System™ are trademarks.
