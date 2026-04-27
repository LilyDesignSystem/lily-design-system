# InfoState

A composition of illustration, title, description, and action for empty, info, error, and success states. Renders a semantic `<section role="status">` with the level exposed via `data-level` for consumer styling.

When `children` is provided, it replaces the default `title` / `description` / `action` layout, allowing fully custom content while keeping the surrounding semantics (`<section>`, `role="status"`, `data-level`, `aria-label`).

## Implementation Notes

- `<section role="status">` for polite announcements
- `aria-label` defaults to `title`; override via `label`
- `data-level` exposes the state category for CSS hooks
- `children` replaces the default layout

## Props

- `level`: `"info" | "empty" | "error" | "success"` (default: `"info"`)
- `title`: string (**required**) -- heading text
- `description`: string (optional) -- body text
- `label`: string (optional) -- `aria-label` override
- `illustration`: ReactNode (optional) -- visual element above the title
- `action`: ReactNode (optional) -- call-to-action area below description
- `children`: ReactNode (optional) -- custom content replaces default layout
- `...restProps`: Any additional HTML attributes passed to the `<section>`

## Usage

```tsx
<InfoState
  level="empty"
  title="Your inbox is empty"
  description="When you get a message it will show up here."
  illustration={<EmptyIllustration />}
  action={<button onClick={refresh}>Refresh</button>}
/>

<InfoState level="error" title="Something went wrong">
  <p>Custom content goes here.</p>
</InfoState>
```

## Keyboard Interactions

- None on the container; action elements provide their own keyboard support

## ARIA

- `role="status"` for polite announcements
- `aria-label` set from `label` or `title`
- `data-level` exposes the state category
