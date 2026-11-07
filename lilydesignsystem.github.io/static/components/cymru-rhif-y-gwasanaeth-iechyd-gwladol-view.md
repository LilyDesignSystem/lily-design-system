# Cymru Rhif Y Gwasanaeth Iechyd Gwladol View

CymruRhifYGwasanaethIechydGwladolView is a headless read-only display of Wales's Rhif y Gwasanaeth Iechyd Gwladol (Rhif GIG), Wales's healthcare identifier. It renders as a `<span>`. It is the read-only companion to CymruRhifYGwasanaethIechydGwladolInput.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

## Implementation Notes

- Renders as `<span>`, with no role
- Format: 10 digits in 3-3-4 format with a Modulus-11 check digit (shared with England and the Isle of Man)
- Provides accessible name via the `value` content
- Companion to CymruRhifYGwasanaethIechydGwladolInput

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="National Health Service Number">
    <CymruRhifYGwasanaethIechydGwladolView value="{value}" />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- No role, and no `aria-label`: a `<span>` cannot take a name, so `label` renders as hidden text in a `screen-reader-span`

## When to Use

- Use to display a stored Wales Rhif y Gwasanaeth Iechyd Gwladol (Rhif GIG) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `cymru-rhif-y-gwasanaeth-iechyd-gwladol-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.cymru-rhif-y-gwasanaeth-iechyd-gwladol-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class, no role and no `aria-label`
- Verify the `value` prop is rendered as text content
- Verify `label` renders as hidden text, and that the root has no `aria-label`

## Domain Knowledge

Ten-digit identifier in 3-3-4 format with a Modulus-11 check digit, shared with England and the Isle of Man and issued at birth or on first registration with a GP.

**Where to find it:** NHS Wales medical card, GP correspondence, prescriptions, hospital appointment letters, and the NHS Wales App.

## Related components

- `cymru-rhif-y-gwasanaeth-iechyd-gwladol-input` — an input for entering Wales's Rhif y Gwasanaeth Iechyd Gwladol (Rhif GIG)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: https://en.wikipedia.org/wiki/NHS_number

---

Lily™ and Lily Design System™ are trademarks.
