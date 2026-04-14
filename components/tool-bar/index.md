# Tool Bar

A toolbar is a container for action buttons and controls using the ARIA toolbar role. It provides left/right arrow key navigation between items with Home/End keys to jump to first/last items, implementing the roving focus pattern for efficient keyboard interaction.

The component queries focusable children via `button`, `[role='button']`, and `[tabindex]` selectors, enabling arrow key navigation to wrap around from last to first and vice versa. This allows users to Tab into the toolbar once, then use arrow keys to move between items, and Tab out to continue through the page.

## Implementation Notes

- Renders as a `<div>` with `role="toolbar"` and built-in keyboard navigation
- Arrow keys (Left/Right) move focus between toolbar items using roving focus
- Home/End keys jump to first/last toolbar item
- Focus wraps around from last item to first and vice versa
- Queries focusable items via `button`, `[role='button']`, and `[tabindex]` selectors
- Uses reactive state for the toolbar element reference and two-way `this` binding for DOM access
- Accessible name is set via `aria-label` from the `label` prop

## Props

- `label`: string (required) -- accessible name for the toolbar via `aria-label`
- `children`: slot (required) -- toolbar item elements
- `...restProps`: Any additional HTML attributes passed to the `<div>` element

## Usage

```html
<ToolBar label="Text formatting">
  <ToolBarButton>Bold</ToolBarButton>
  <ToolBarButton>Italic</ToolBarButton>
  <ToolBarButton>Underline</ToolBarButton>
  <ToolBarButton disabled>Strikethrough</ToolBarButton>
</ToolBar>
```

```html
<ToolBar label="Image editing controls">
  <ToolBarButton aria-label="Crop">Crop</ToolBarButton>
  <ToolBarButton aria-label="Rotate left">Rotate</ToolBarButton>
  <ToolBarButton aria-label="Zoom in">Zoom In</ToolBarButton>
  <ToolBarButton aria-label="Zoom out">Zoom Out</ToolBarButton>
</ToolBar>
```

## Keyboard Interactions

- ArrowRight: Move focus to next item (wraps to first)
- ArrowLeft: Move focus to previous item (wraps to last)
- Home: Move focus to first item
- End: Move focus to last item
- Tab: Enter/exit the toolbar

## ARIA

- `role="toolbar"` -- identifies the container as a toolbar widget
- `aria-label` -- provides the accessible name for the toolbar

## When to Use

- Use for a horizontal bar of tool actions, such as formatting buttons in a text editor or actions on a selected item.
- Use when you have a row of action buttons that benefit from roving focus keyboard navigation.
- Use when you want users to Tab into the toolbar once, arrow between items, and Tab out.
- Use for drawing tools, media controls, image editing, or code editor actions.
- Use with ToolBarButton children for consistent button semantics within the bar.

## When Not to Use

- Do not use for navigation -- use TabBar or MenuBar instead.
- Do not use for task shortcuts -- use TaskBar instead.
- Do not use when there are only two or three actions that do not need roving focus -- use a simple button group.
- Do not use for dropdown-style menus -- use Menu or DropdownMenu instead.

## Headless

This headless component provides a `<div>` with `role="toolbar"`, `aria-label`, and built-in roving focus keyboard navigation (ArrowLeft, ArrowRight, Home, End). It queries focusable children automatically. The consumer provides all button elements as children and all visual styling.


## Styles

The consumer provides all CSS styling. The component renders with a `.tool-bar` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `tool-bar`
- Verify role="toolbar"` -- identifies the container as a toolbar widget
- Verify aria-label` -- provides the accessible name for the toolbar
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Group related actions visually with separators or spacing. Use consistent icon sizes and provide tooltips for icon-only buttons.
- **Developers**: Ensure all toolbar items are focusable (`<button>`, `[role="button"]`, or elements with `tabindex`). The component handles focus management automatically.

## Composition

ToolBar contains ToolBarButton children following the Bar/BarButton pattern. ToolBar provides the toolbar container with keyboard navigation, and each ToolBarButton provides a single action button within the toolbar.

## References

- WAI-ARIA Toolbar Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/toolbar/
