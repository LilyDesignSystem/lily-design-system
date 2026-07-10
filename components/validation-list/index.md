# Validation List

A validation list is a `<ul>` of `validation-list-item` rules that
provides live feedback as the user types — typically next to a password
field, a username field, or any input with multiple rules.

Use it to give users instant, accessible confirmation as each requirement
is met (or unmet) without waiting for form submission.

## Implementation Notes

- Renders a native `<ul>` element with class `validation-list`
- `label` prop is **required** — sets `aria-label` describing the field the rules apply to
- `aria-live="polite"` is set on the list so status changes are announced
- Children are expected to be `validation-list-item` elements with status props
- The `<ul>` semantics provide list count and item position to screen readers
- Pass-through attributes are forwarded to the root `<ul>`

## Composition

This component is part of the `*List` `*ListItem` composition pattern.
Pair it with `ValidationListItem` children to render the rule set.

## Props

- `label`: string (**required**) -- aria-label describing the field
- `children`: slot -- `validation-list-item` children
- `...restProps`: any additional HTML attributes

## Usage

Password requirements:

```html
<ValidationList label="Password requirements">
  <ValidationListItem status={lengthOk ? "passed" : "failed"}>
    At least 8 characters
  </ValidationListItem>
  <ValidationListItem status={hasNumber ? "passed" : "failed"}>
    At least one number
  </ValidationListItem>
  <ValidationListItem status={hasSymbol ? "passed" : "pending"}>
    At least one symbol
  </ValidationListItem>
</ValidationList>
```

## Keyboard Interactions

- Tab: moves focus past the list (the list is not interactive)
- The list itself does not handle keyboard input

## ARIA

- Implicit `list` role from `<ul>` element
- `aria-label` describes which input the rules apply to
- `aria-live="polite"` announces status changes as the user types
- Each child contributes a list item via its `<li>` element

## When to Use

- Use next to inputs that have multiple validation rules.
- Use when users benefit from real-time feedback (passwords, usernames, custom identifiers).

## When Not to Use

- Do not use for a single rule — use `Hint` or `ErrorMessage` instead.
- Do not use after form submission — use `ErrorSummary` for batched errors.
- Do not use as a generic checklist — use `CheckList` instead.

## Headless

Renders the structural skeleton — `<ul>` with `aria-live="polite"`. The
status icons (pending dot, check mark, cross) and color treatment for
each item state are entirely the consumer's responsibility, driven by
`data-status` on each child.

## Styles

Consumer CSS targets the `validation-list` class. Typical treatments
remove default list bullets and apply consistent vertical spacing.
Per-item visual states are styled via the inner `validation-list-item[data-status]`
attribute selectors.

## Testing

- Verify the component renders a `<ul>` element with class `validation-list`
- Verify `aria-label` is present and equals the `label` prop
- Verify `aria-live="polite"` is set on the list
- Verify children render inside the list
- Verify additional HTML attributes pass through to the root `<ul>`

## Advice

- **Designers**: Keep rule text short and start each rule with a verb-free statement (e.g., "At least 8 characters"). Use color plus an icon to signal state — never color alone.
- **Developers**: Always supply `ValidationListItem` children with the appropriate `status` prop. Update the `status` reactively as the user types.

## Related components

- `validation-list-item` — one validation rule in a validation list with a status of pending, passed, or failed

## References

- US Web Design System Validation: https://designsystem.digital.gov/components/validation/
- WAI-ARIA aria-live: https://www.w3.org/TR/wai-aria-1.2/#aria-live
- WCAG 3.3.1 Error Identification: https://www.w3.org/WAI/WCAG22/Understanding/error-identification

---

Lily™ and Lily Design System™ are trademarks.
