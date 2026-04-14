# DialGroup

A dial group is a container for multiple dial components, providing semantic grouping for related rotary controls. Dial groups are used when several dials need to be presented and operated together, such as audio mixing controls or multi-parameter adjustments.

This headless component uses a `<div>` element with `role="group"` and an `aria-label` to provide accessible grouping semantics for the contained dial components.

## Implementation Notes

- Uses `<div>` element with `role="group"` to semantically group dials
- `aria-label` describes the group purpose
- Renders child dial components in source order
- Consumer controls layout and spacing via CSS

## Props

- `label`: string (required) -- accessible label for the dial group
- `children`: slot -- dial components
- `...restProps`: Any additional HTML attributes

## Usage

Audio mixer with volume, bass, and treble controls:

```html
<DialGroup label="Audio controls">
  <Dial label="Volume" value={volume} min={0} max={100} />
  <Dial label="Bass" value={bass} min={0} max={100} />
  <Dial label="Treble" value={treble} min={0} max={100} />
</DialGroup>
```

HVAC control panel:

```html
<DialGroup label="Climate controls">
  <Dial label="Temperature" value={temperature} min={16} max={30} step={0.5} />
  <Dial label="Fan speed" value={fanSpeed} min={1} max={5} />
</DialGroup>
```

## Keyboard Interactions

- None at the group level -- individual dials handle their own keyboard interactions

## ARIA

- `role="group"` -- semantically groups the contained dials
- `aria-label` -- describes the purpose of the group

## When to Use

- Use to group multiple dial controls together, such as an audio mixer or multi-parameter control panel.
- Use when multiple dials share a common purpose and should be perceived as a group by assistive technology.
- Use for equalizer interfaces, multi-channel audio controls, or multi-axis configuration panels.

## When Not to Use

- Do not use for a single dial -- render Dial directly without a group wrapper.
- Do not use for linear slider groups -- use multiple Slider components instead.

## Headless

This component provides `role="group"` with `aria-label` for accessible grouping, with zero visual styling. The consumer is responsible for all CSS including layout direction, spacing, alignment, and responsive behavior.

## Styles

The consumer provides all CSS styling. The component renders with a `.dial-group` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<div>` element with class `dial-group`
- Verify `role="group"` is present
- Verify `aria-label` is applied
- Verify child dial components are rendered
- Verify pass-through attributes are applied

## Advice

- **Designers**: Arrange dials in a logical order that reflects their relationship. Use consistent sizing and spacing within the group.
- **Developers**: Always provide a descriptive `label` prop that conveys the group's purpose to screen readers.

## Composition

DialGroup is a container for Dial components.
