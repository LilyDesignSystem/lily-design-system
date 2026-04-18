# Flair

A flair is a small inline element used to add visual emphasis, categorization, or status labeling to elements within an interface. Commonly used as tags, badges, or labels in forums, social platforms, or dashboards, flair can indicate user roles, content types, statuses, or categories (e.g., "Moderator", "Urgent", "New").

By default the flair is treated as decorative (`aria-hidden="true"`), meaning screen readers skip it. When a `label` prop is provided, the flair becomes meaningful and is announced to assistive technology via `aria-label`, making it suitable for conveying important status information.

## Implementation Notes

- Renders a `<span>` element for inline display
- When no `label` is provided, sets `aria-hidden="true"` to mark it as decorative
- When `label` is provided, sets `aria-label` for screen reader announcement and removes `aria-hidden`
- Spreads `restProps` onto the `<span>` element for consumer customization

## Props

- `label`: string (default: undefined) -- accessible label; omit for decorative flair, provide for meaningful flair
- `children`: Snippet (required) -- flair content text

## Usage

```svelte
<Flair>New</Flair>
```

```svelte
<Flair label="Status: new">New</Flair>
```

## Keyboard Interactions

None -- this component is a passive inline display element.

## ARIA

- `aria-hidden="true"` -- applied when no `label` is provided, marking the flair as decorative
- `aria-label` -- applied when `label` is provided, giving the flair an accessible name for screen readers
