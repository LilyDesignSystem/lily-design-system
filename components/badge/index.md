# Badge

A badge is a small inline component for displaying dynamic status information, counts, or short labels in a compact, prominent format. Badges are commonly used to show unread message counts, notification indicators, or activity statuses attached to icons, buttons, or list items.

The component renders as a `<span>` with `role="status"`, creating an ARIA live region that announces content changes to screen readers. The `data-type` attribute exposes the semantic variant for consumer CSS styling, and an optional `aria-label` provides expanded context when the visible badge text alone is insufficient (e.g., "3" displayed visually but "3 unread messages" announced to screen readers).

## Implementation Notes

- Renders as `<span role="status">` for screen reader announcements of dynamic content
- `data-type` attribute exposes variant for consumer CSS styling
- `aria-label` provides expanded context when badge text alone is insufficient
- Five semantic variants: default, info, success, warning, error
- Content is provided through child elements

## Props

- `type`: "default" | "info" | "success" | "warning" | "error" (default: "default") -- badge variant for semantic meaning
- `label`: string (optional) -- accessible label for screen readers
- `children`: slot (required) -- badge content (text, number, etc.)
- `...restProps`: Any additional HTML attributes passed to the `<span>` element

## Usage

Unread message count on a navigation link:

```html
<a href="/messages">
  Messages <Badge label="12 unread messages">12</Badge>
</a>
```

Notification count on an icon button:

```html
<button aria-label="Notifications">
  <Icon name="bell" />
  <Badge label="3 new notifications">3</Badge>
</button>
```

Warning status badge:

```html
<Badge type="warning" label="2 items require attention">2</Badge>
```

## Keyboard Interactions

- None -- badges are informational, not interactive

## ARIA

- `role="status"` -- creates an ARIA live region for dynamic content announcements
- `aria-label` -- optional expanded context for screen readers beyond the visible text

## When to Use

- Use for small counts, categories, or labels attached to another element, such as unread message counts or notification indicators.
- Use when the badge value is supplementary and the parent element is understandable without it.
- Use when dynamic content changes need to be announced to screen readers via the `role="status"` live region.
- Use with the `label` prop to provide expanded context for screen readers when the visible text alone is insufficient.
- Use the `type` prop to communicate semantic meaning (info, success, warning, error) through `data-type` for consumer styling.

## When Not to Use

- Do not use for status indicators that are the primary content -- use Tag for labels like "Active" or "Completed".
- Do not use for prominent call-to-action labels -- use CallToAction instead.
- Do not use for decorative emphasis -- use Flair instead.
- Do not use for long text content -- use Alert or Banner instead.

## Headless

This component provides `role="status"` for ARIA live region announcements, a `data-type` attribute for semantic variants, and optional `aria-label` with zero visual styling. The consumer is responsible for all CSS including background color, text color, border radius, font size, padding, and positioning relative to the parent element.


## Styles

The consumer provides all CSS styling. The component renders with a `.badge` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<span>` element with class `badge`
- Verify role="status"` -- creates an ARIA live region for dynamic content announcements
- Verify aria-label` -- optional expanded context for screen readers beyond the visible text
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Keep badge content to 1-3 characters for counts or short labels. Use consistent sizing and position (e.g., top-right of an icon) across the interface.
- **Developers**: Use the `label` prop to provide expanded context for screen readers, e.g., `label="3 unread messages"` when the visible badge only shows "3".
