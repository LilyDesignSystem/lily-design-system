# Icon List Item

An icon list item is one entry in an `icon-list`, with an optional leading
icon slot and the item text content.

Use it inside `IconList` to render a list of statements that each begin
with a visual marker (check, arrow, dot, etc.).

## Implementation Notes

- Renders a native `<li>` element with class `icon-list-item`
- `icon` slot/snippet/ReactNode is optional — when supplied it renders inside `<span class="icon-list-item-icon" aria-hidden="true">`
- The icon span is decorative; the item text remains the accessible content
- Item text content renders inside `<span class="icon-list-item-text">`
- Pass-through attributes are forwarded to the root `<li>`

## Composition

This component is part of the `*List` `*ListItem` composition pattern.
It must be a child of `IconList`.

## Props

- `icon`: slot/snippet/ReactNode (optional) -- leading icon content
- `children`: slot -- text content of the item
- `...restProps`: any additional HTML attributes

## Usage

Item with check-mark icon:

```html
<IconListItem>
  {#snippet icon()}<CheckIcon />{/snippet}
  Free shipping on every order
</IconListItem>
```

Plain item with no icon:

```html
<IconListItem>
  Cancel anytime
</IconListItem>
```

## Keyboard Interactions

- Tab: moves focus to interactive descendants (links, buttons) within the item
- The item itself is not interactive

## ARIA

- Implicit `listitem` role from `<li>` element
- The icon span has `aria-hidden="true"` so it is excluded from the accessibility tree
- The text span carries the accessible content of the item

## When to Use

- Use as a child of `IconList` to render a single statement with a leading icon.
- Use when the same icon is repeated for each item in the list.

## When Not to Use

- Do not use outside an `IconList`.
- Do not use for navigation list items — use a `*ListItem` from a navigation composition.

## Headless

Renders the structural skeleton — `<li>` with two inner `<span>`
elements. Visual size, alignment, and color of the icon and text are
entirely the consumer's responsibility.

## Styles

Consumer CSS targets the `icon-list-item` class plus the inner
`icon-list-item-icon` and `icon-list-item-text` classes for fine-grained
control.

## Testing

- Verify the component renders an `<li>` element with class `icon-list-item`
- Verify the icon span renders only when the `icon` slot is provided
- Verify the icon span has `aria-hidden="true"`
- Verify the icon span has class `icon-list-item-icon`
- Verify the text span has class `icon-list-item-text`
- Verify children render inside the text span
- Verify additional HTML attributes pass through to the root `<li>`

## Advice

- **Designers**: Use a single icon style across all items in a list. Keep the icon size compact relative to the text.
- **Developers**: Treat the icon as decorative. Do not place meaningful information only inside the icon — repeat it in the text.

## Related components

- `icon-list` — an ordered list of icon list item components

## References

- US Web Design System Icon List: https://designsystem.digital.gov/components/icon-list/
- HTML `<li>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li
- WAI-ARIA aria-hidden: https://www.w3.org/TR/wai-aria-1.2/#aria-hidden
