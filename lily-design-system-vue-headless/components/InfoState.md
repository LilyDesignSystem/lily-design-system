# InfoState

A composition for empty, error, info, and success states. Renders a `<section role="status" class="info-state">` with optional illustration, required title, optional description, and optional action area.

## Implementation Notes

- Headless: no CSS or styles
- `data-level` attribute exposes the variant (`info`, `empty`, `error`, `success`)
- `aria-label` defaults to the title; `label` prop overrides
- `default` slot replaces the title/description/action structure entirely

## Props

- `level`: `"info" | "empty" | "error" | "success"` (default `"info"`)
- `title`: string (**required**)
- `description`: string (optional)
- `label`: string (optional) — `aria-label` override
- named slot `illustration` — visual above the title
- named slot `action` — CTA buttons below the description
- default slot — replaces the structured layout
- `...$attrs` — additional HTML attributes

## Usage

```vue
<InfoState level="empty" title="No tasks" description="Create one to get started">
    <template #illustration><svg>...</svg></template>
    <template #action>
        <button>Create task</button>
    </template>
</InfoState>

<InfoState level="error" title="Something went wrong" description="Try again later" />
```

## Keyboard Interactions

- None at the container level; any focusable elements inside the `action` slot follow native tab order.

## ARIA

- `role="status"` announces non-disruptive state changes politely
- `aria-label` defaults to the `title`

## When to Use

- Empty list/zero-data states
- Inline error or success messages
- Onboarding placeholders

## When Not to Use

- Modal urgent errors — use `AlertDialog`
- Toast notifications — use `Toast`

## Headless

No styles are applied. The component exposes data attributes and semantic structure; consumers style each level via `[data-level=...]` selectors.

## Testing

- Verify root `<section role="status">` with `info-state` class
- Verify the title is rendered in an `<h2>`
- Verify `data-level` defaults and overrides
- Verify named slots render
- Verify default slot replaces structured layout

## References

- [WAI-ARIA `role="status"`](https://www.w3.org/TR/wai-aria-1.2/#status)
