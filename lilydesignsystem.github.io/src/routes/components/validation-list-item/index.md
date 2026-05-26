# Validation List Item

A validation list item is one rule inside a `validation-list`, with a
status of `pending`, `passed`, or `failed` exposed via a `data-status`
attribute for consumer styling.

Use it inside `ValidationList` to represent each individual validation
rule that the user must satisfy.

## Implementation Notes

- Renders a native `<li>` element with class `validation-list-item`
- `status` prop is one of `"pending"`, `"passed"`, or `"failed"` (default `"pending"`)
- `status` is rendered as a `data-status` attribute on the `<li>` for consumer styling
- `label` prop is optional — when supplied it sets `aria-label` (overriding the children text as the accessible name)
- Children render the rule text (e.g., "At least 8 characters")
- Pass-through attributes are forwarded to the root `<li>`

## Composition

This component is part of the `*List` `*ListItem` composition pattern.
It must be a child of `ValidationList`.

## Props

- `status`: `"pending" | "passed" | "failed"` (default: `"pending"`)
- `label`: string (optional) -- aria-label override
- `children`: slot -- rule text (e.g., "At least 8 characters")
- `...restProps`: any additional HTML attributes

## Usage

Pending rule:

```html
<ValidationListItem status="pending">At least 8 characters</ValidationListItem>
```

Passed rule:

```html
<ValidationListItem status="passed">At least one number</ValidationListItem>
```

Failed rule with screen-reader override:

```html
<ValidationListItem status="failed" label="Symbol requirement not met">
  At least one symbol
</ValidationListItem>
```

## Keyboard Interactions

- None — the item is not interactive
- Tab moves focus past the item

## ARIA

- Implicit `listitem` role from `<li>` element
- `aria-label` is rendered when `label` is supplied
- `data-status` exposes the rule state for consumer styling and consumer JS
- Status changes are announced through the parent `validation-list`'s `aria-live="polite"`

## When to Use

- Use as a child of `ValidationList` to represent one validation rule.
- Use to expose pending / passed / failed state via `data-status` for visual treatment.

## When Not to Use

- Do not use outside a `ValidationList`.
- Do not use as a generic checklist item — use `CheckListItem` instead.

## Headless

Renders only the `<li>` and its `data-status`. The status icon (dot,
check, cross) and color treatment are entirely the consumer's
responsibility, driven by `[data-status="pending"]`,
`[data-status="passed"]`, and `[data-status="failed"]` selectors.

## Styles

Consumer CSS targets the `validation-list-item` class with
`[data-status]` attribute selectors:

```css
.validation-list-item[data-status="pending"] { /* pending styles */ }
.validation-list-item[data-status="passed"] { /* passed styles */ }
.validation-list-item[data-status="failed"] { /* failed styles */ }
```

## Testing

- Verify the component renders an `<li>` element with class `validation-list-item`
- Verify `data-status` defaults to `"pending"`
- Verify `data-status` reflects the `status` prop
- Verify `aria-label` is rendered when `label` is supplied
- Verify children render inside the item
- Verify additional HTML attributes pass through to the root `<li>`

## Advice

- **Designers**: Use color plus an icon to signal each status — never color alone. Pending should look passive (gray dot), passed should look successful (green check), failed should look corrective (red cross).
- **Developers**: Update the `status` prop reactively as the user types. The parent `ValidationList`'s `aria-live="polite"` ensures the change is announced.

## Related components

- `validation-list` — a live-feedback list of input validation rules with pending, passed, and failed states

## References

- US Web Design System Validation: https://designsystem.digital.gov/components/validation/
- HTML `<li>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li
- WCAG 1.4.1 Use of Color: https://www.w3.org/WAI/WCAG22/Understanding/use-of-color
