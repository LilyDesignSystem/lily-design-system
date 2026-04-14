# Tool Bar Button

A tool bar button is a single button within a toolbar, rendered as a native `<button>` element for proper keyboard and screen reader support. It is designed to be placed inside a ToolBar container that manages roving focus keyboard navigation.

The component uses `<button type="button">` to avoid unintended form submissions and supports the `disabled` attribute for disabling interaction. Content is provided through the children slot, allowing full flexibility in button content.

## Help

Use ToolBarButton for individual action buttons within a ToolBar. Common scenarios include text formatting buttons (Bold, Italic, Underline), drawing tool selectors, or media controls. The parent ToolBar manages keyboard navigation between buttons.

## Syntax

```html
<ToolBarButton>Label</ToolBarButton>
```

## Usage

```html
<ToolBar label="Text formatting">
  <ToolBarButton>Bold</ToolBarButton>
  <ToolBarButton>Italic</ToolBarButton>
  <ToolBarButton disabled>Strikethrough</ToolBarButton>
</ToolBar>
```

```html
<ToolBar label="Drawing tools">
  <ToolBarButton aria-label="Pen tool">Pen</ToolBarButton>
  <ToolBarButton aria-label="Eraser tool">Eraser</ToolBarButton>
  <ToolBarButton aria-label="Fill tool" disabled>Fill</ToolBarButton>
</ToolBar>
```

## Props

| Prop           | Type            | Default    | Description                                            |
| -------------- | --------------- | ---------- | ------------------------------------------------------ |
| `disabled`     | `boolean`       | `false`    | Whether the button is disabled                         |
| `children`     | `slot`       | (required) | Button content                                         |
| `...restProps` | HTML attributes |            | Additional attributes passed to the `<button>` element |

## Examples

Inside a ToolBar:

```html
<ToolBar label="Text formatting">
  <ToolBarButton>Bold</ToolBarButton>
  <ToolBarButton>Italic</ToolBarButton>
  <ToolBarButton disabled>Strikethrough</ToolBarButton>
</ToolBar>
```

## Keyboard Interactions

- Tab: Focus the button (when not inside a ToolBar managing roving focus)
- Enter / Space: Activate the button (browser default)
- Arrow keys: Handled by parent ToolBar for roving focus navigation
- Button is skipped in tab order when `disabled` is true

## ARIA

- Implicit `button` role from the `<button>` element
- `disabled` attribute communicates disabled state to assistive technology
## When to Use

- Use inside ToolBar to represent one tool action such as formatting controls, drawing tools, or media actions.
- Use when you want a consistent button component that integrates with the parent ToolBar's roving focus navigation.
- Use for icon-only buttons with `aria-label` for accessible labelling.

## When Not to Use

- Do not use outside ToolBar -- use Button for standalone actions.
- Do not use for task shortcuts -- use TaskBarButton inside a TaskBar instead.
- Do not use for navigation links -- use ActionLink instead.

## Headless

This headless component provides a native `<button type="button">` element with `disabled` support. It relies on the parent ToolBar for roving focus keyboard navigation. The consumer provides all content (text, icons) and all visual styling.


## Styles

The consumer provides all CSS styling. The component renders with a `.tool-bar-button` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<button>` element with class `tool-bar-button`
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Maintain consistent button sizing within the toolbar. For icon-only buttons, ensure there is an accessible label or tooltip.
- **Developers**: Use `type="button"` (already set) to prevent unintended form submissions. Pass additional attributes like `aria-label` via restProps for icon-only buttons.

## Composition

ToolBarButton is a child of ToolBar, following the Bar/BarButton pattern. The parent ToolBar manages roving focus navigation between ToolBarButton children.

## References

- WAI-ARIA Toolbar Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/toolbar/
