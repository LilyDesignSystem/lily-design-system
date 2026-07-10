# Info State

An info state is a composition of an optional illustration, a title, an
optional description, and an optional action area used to communicate empty,
informational, error, or success conditions in place of normal content.

Use it whenever a region of the UI cannot show its usual content — empty
search results, an error fetching data, an onboarding placeholder, or a
success acknowledgment.

## Implementation Notes

- Renders a `<section>` with `role="status"` so updates are announced politely by assistive technology
- Sets `data-level={level}` so consumer CSS can apply variant treatment
- Uses an `<h2>` for the title and `<p>` for the description
- Illustration and action are optional slots placed above the title and below the description respectively
- Default `aria-label` is the title; consumer may override via `label`
- Children, when provided, become the entire body and replace the title/description/action layout

## Props

- `level`: "info" | "empty" | "error" | "success" (default: "info") -- variant
- `title`: string (required) -- section heading text
- `description`: string (optional) -- body text
- `label`: string (optional) -- aria-label override (defaults to `title`)
- `illustration`: slot (optional) -- visual element above the title
- `action`: slot (optional) -- call-to-action below the description
- `children`: slot (optional) -- replaces the structured layout entirely
- `...restProps`: any additional HTML attributes

## Usage

Empty state with action:

```html
<InfoState
  level="empty"
  title="No results found"
  description="Try adjusting your filters."
>
  <svg slot="illustration">...</svg>
  <Button slot="action">Clear filters</Button>
</InfoState>
```

Error state:

```html
<InfoState
  level="error"
  title="Could not load orders"
  description="Please try again or contact support."
>
  <Button slot="action" onclick={retry}>Retry</Button>
</InfoState>
```

Custom body via children slot:

```html
<InfoState level="info" title="Welcome">
  <p>Anything you want here.</p>
</InfoState>
```

## Keyboard Interactions

- None on the container itself
- Focusable controls inside the `action` slot follow their own keyboard behavior

## ARIA

- `role="status"` on the section announces non-disruptive updates
- `aria-label` falls back to the title when no label is provided
- `data-level` exposes the variant for consumer CSS without changing semantics

## When to Use

- Use for empty results, errors, success acknowledgments, and informational placeholders.
- Use to give users a clear next step via the `action` slot.
- Use in place of an empty content region so the UI remains explanatory rather than blank.

## When Not to Use

- Do not use for blocking modal dialogs (use AlertDialog).
- Do not use for transient toasts or alerts (use Toast or Alert).
- Do not use as a heavyweight error boundary — keep messaging concise.

## Headless

Provides only the semantic structure (`<section>` with role, heading, paragraph,
illustration and action slots, data-level). All visual treatment, including
variant colors, spacing, and illustration sizing, is the consumer's
responsibility.

## Styles

Consumer CSS targets `.info-state` and `.info-state[data-level="error"]`,
`[data-level="empty"]`, `[data-level="success"]`, `[data-level="info"]` for
variants.

## Testing

- Verify the component renders a `<section>` element with class `info-state`
- Verify `role="status"` is applied
- Verify `data-level` matches the `level` prop
- Verify the title renders inside an `<h2>`
- Verify the description renders inside a `<p>` when provided
- Verify the illustration and action slots render when provided
- Verify `aria-label` defaults to `title` and can be overridden by `label`
- Verify children replace the structured layout

## Advice

- **Designers**: Pair each info state with a clear next-step action — empty states without guidance are dead ends. Differentiate `level` variants visually with color and iconography.
- **Developers**: Use `level="error"` for recoverable failures and provide a Retry action. Reserve children-slot replacement for cases that genuinely need a custom body.

## Related components

- `panel` — a generic content panel with optional heading
- `loading` — a loading indicator, such as text, or image, or animation
- `skeleton` — a placeholder loading animation for content
- `alert` — a status message for important information or feedback

## References

- WAI-ARIA status role: https://www.w3.org/TR/wai-aria-1.2/#status
- Nielsen Norman empty state guidance: https://www.nngroup.com/articles/empty-state-interface-design/

---

Lily™ and Lily Design System™ are trademarks.
