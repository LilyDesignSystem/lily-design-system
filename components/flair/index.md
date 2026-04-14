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
- `children`: slot (required) -- flair content text

## Usage

Decorative "New" marker on a content listing:

```html
<h3>Getting started guide <Flair>New</Flair></h3>
```

Meaningful flair with accessible label for a user role:

```html
<span>Posted by Alice <Flair label="Role: Moderator">Moderator</Flair></span>
```

Featured content marker:

```html
<a href="/articles/best-practices">
  Best practices for accessible forms <Flair label="Featured article">Featured</Flair>
</a>
```

## Keyboard Interactions

None -- this component is a passive inline display element.

## ARIA

- `aria-hidden="true"` -- applied when no `label` is provided, marking the flair as decorative
- `aria-label` -- applied when `label` is provided, giving the flair an accessible name for screen readers

## When to Use

- Use for decorative visual emphasis or highlight on text, such as "New", "Featured", or "Popular" markers.
- Use when the emphasis is supplementary and the surrounding content is understandable without the flair.
- Use in forums, dashboards, or content listings where user roles or content types need quick visual identification.
- Use with the `label` prop when the flair conveys meaningful information that screen readers should announce.

## When Not to Use

- Do not use for status indicators that convey critical information -- use Tag instead.
- Do not use for counts or category labels that update dynamically -- use Badge instead.
- Do not use for AI transparency indicators -- use AiLabel instead.

## Headless

This headless component provides a `<span>` with conditional `aria-hidden` or `aria-label` depending on whether the flair is decorative or meaningful. The consumer provides all visual styling including background color, border, font size, and padding.


## Styles

The consumer provides all CSS styling. The component renders with a `.flair` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<span>` element with class `flair`
- Verify aria-label` -- applied when `label` is provided, giving the flair an accessible name for screen readers
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use consistent color coding across your application for flair categories. Keep flair text short -- one or two words maximum.
- **Developers**: Provide the `label` prop whenever the flair conveys meaningful information that is not available from surrounding text. Omit `label` only for purely decorative flair.
