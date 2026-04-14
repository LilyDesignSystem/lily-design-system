# Toggle Group

ToggleGroup is a headless container for a collection of related toggle buttons. It uses the ARIA `group` role with an accessible label to semantically associate toggle buttons, making their relationship understandable to assistive technologies.

This component is useful for text formatting toolbars (bold, italic, underline), view mode selectors, or any interface where multiple options can be independently toggled on or off. Each child button should use `aria-pressed` to indicate its toggle state. Consumers provide the individual toggle buttons as children and bring their own styling.

## Implementation Notes

- Renders a `<div>` with `role="group"` to semantically group child toggle buttons
- Uses `aria-label` for an accessible name describing the group
- Accepts a `children` slot for rendering toggle button elements inside the group
- Spreads `restProps` onto the container for consumer customization
- pattern: standard props destructuring with typed props

## Props

- `label`: string (required) -- accessible name for the group via `aria-label`
- `children`: slot (required) -- toggle button elements to render inside the group
- `...restProps`: unknown -- additional attributes spread onto the container `<div>`

## Usage

Text formatting toolbar with independent toggles:

```html
<ToggleGroup label="Text formatting">
  <ToggleButton label="Bold" pressed={isBold} />
  <ToggleButton label="Italic" pressed={isItalic} />
  <ToggleButton label="Underline" pressed={isUnderline} />
</ToggleGroup>
```

View mode selector:

```html
<ToggleGroup label="View mode">
  <ToggleButton label="Grid view" pressed={isGrid} />
  <ToggleButton label="List view" pressed={isList} />
</ToggleGroup>
```

## Keyboard Interactions

None at the container level. Keyboard behavior depends on the child toggle button elements provided by the consumer (typically Tab to navigate between buttons, Enter/Space to toggle).

## ARIA

- `role="group"` -- identifies the container as a semantic grouping of related toggle buttons
- `aria-label={label}` -- provides an accessible name describing the purpose of the toggle collection

## When to Use

- Use to group multiple toggle buttons for selecting one or more options, such as text alignment or view modes.
- Use for text formatting toolbars where bold, italic, and underline can be independently toggled.
- Use when multiple toggles share a common purpose and should be perceived as a group by assistive technology.
- Use for filter panels where multiple independent options can be activated simultaneously.

## When Not to Use

- Do not use for mutually exclusive single selection -- use SegmentGroup instead.
- Do not use for form choices requiring submission -- use RadioGroup or CheckboxGroup instead.
- Do not use for a single toggle -- render ToggleButton directly without a group wrapper.

## Headless

This headless component provides a `<div>` with `role="group"` and `aria-label` for accessible grouping of related toggle buttons. The consumer provides individual toggle button elements as children and all visual styling including layout, spacing, and button appearance.


## Styles

The consumer provides all CSS styling. The component renders with a `.toggle-group` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `toggle-group`
- Verify role="group"` -- identifies the container as a semantic grouping of related toggle buttons
- Verify aria-label={label}` -- provides an accessible name describing the purpose of the toggle collection
- Verify pass-through attributes are applied

## Advice

- **Designers**: Visually connect grouped toggles (e.g., shared border, joined buttons) to reinforce that they belong together.
- **Developers**: Each child button should use `aria-pressed` to indicate its individual toggle state. The group does not manage child state; each toggle is independent.

## Composition

ToggleGroup contains ToggleButton children (or plain buttons with `aria-pressed`) following the Group/Item pattern. ToggleGroup provides the semantic grouping container, and each child ToggleButton manages its own pressed state independently.

## References

- WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group
- WAI-ARIA Button Pattern (toggle): https://www.w3.org/WAI/ARIA/apg/patterns/button/
