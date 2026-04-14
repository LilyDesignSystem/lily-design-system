# Segment Group

SegmentGroup is a headless container for segmented controls that uses the ARIA `radiogroup` role. It groups a set of mutually exclusive options, such as view mode toggles (grid/list), filter selections, or display density controls.

Use SegmentGroup when you need a set of visually distinct toggle buttons where only one option can be active at a time. Unlike RadioGroup which wraps native radio inputs in a fieldset, SegmentGroup uses a `<div>` with `role="radiogroup"` and expects children to be buttons with `role="radio"` and `aria-checked` attributes. This makes it suitable for custom segmented control UIs that go beyond standard radio button appearance.

## Implementation Notes

- Renders a `<div>` element with `role="radiogroup"` for ARIA semantics
- The `aria-label` attribute provides an accessible name for the group
- Consumer provides segment button children, each with `role="radio"` and `aria-checked`
- Consumer is responsible for managing selection state (toggling `aria-checked` on children)
- Spreads `restProps` onto the div for consumer customization

## Props

- `label`: string (required) -- accessible label for the segment group, applied via `aria-label`
- `children`: slot (required) -- segment button elements to render inside the group
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Usage

View mode toggle between Grid and List:

```html
<SegmentGroup label="View mode">
  <SegmentGroupItem checked={mode === 'grid'} value="grid" onclick={() => mode = 'grid'}>Grid</SegmentGroupItem>
  <SegmentGroupItem checked={mode === 'list'} value="list" onclick={() => mode = 'list'}>List</SegmentGroupItem>
</SegmentGroup>
```

Task status filter:

```html
<SegmentGroup label="Task filter">
  <SegmentGroupItem checked={filter === 'all'} value="all" onclick={() => filter = 'all'}>All</SegmentGroupItem>
  <SegmentGroupItem checked={filter === 'active'} value="active" onclick={() => filter = 'active'}>Active</SegmentGroupItem>
  <SegmentGroupItem checked={filter === 'completed'} value="completed" onclick={() => filter = 'completed'}>Completed</SegmentGroupItem>
</SegmentGroup>
```

## Keyboard Interactions

- Tab: Moves focus into the segment group
- Arrow Left / Arrow Right: Consumer should implement arrow key navigation between segments (following the radiogroup pattern)
- Space / Enter: Consumer should implement activation of the focused segment

## ARIA

- `role="radiogroup"` -- identifies the container as a group of mutually exclusive radio-like options
- `aria-label={label}` -- provides an accessible name for the group so screen readers announce its purpose

## When to Use

- Use SegmentGroup for mutually exclusive single-select options displayed as connected segments, such as view mode toggles (List/Grid).
- Use SegmentGroup for filter toggles like "All / Active / Completed" in a task manager.
- Use SegmentGroup for display density controls such as "Compact / Normal / Spacious".
- Use SegmentGroup when you want a custom segmented control appearance beyond standard radio buttons.

## When Not to Use

- Do not use SegmentGroup for multi-select options -- use ToggleGroup instead.
- Do not use SegmentGroup for form choices that require submission with standard form semantics -- use RadioGroup instead.
- Do not use SegmentGroup for navigation between pages -- use TabBar instead.

## Headless

The SegmentGroup headless component provides a `<div>` with `role="radiogroup"` and `aria-label` for accessible group naming. It expects children with `role="radio"` and `aria-checked` attributes. The consumer provides all visual styling, selection state management, and keyboard navigation between segments.


## Styles

The consumer provides all CSS styling. The component renders with a `.segment-group` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `segment-group`
- Verify role="radiogroup"` -- identifies the container as a group of mutually exclusive radio-like options
- Verify aria-label={label}` -- provides an accessible name for the group so screen readers announce its purpose
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Give the segmented control a clear visual boundary and ensure the active segment has a prominent selected state (e.g., filled background vs. outlined).
- **Developers**: Implement arrow key navigation between segments following the WAI-ARIA radio group pattern, and manage roving tabindex so only the selected segment receives focus via Tab.

## Composition

SegmentGroup is the container for SegmentGroupItem children. Use `<SegmentGroup>` to wrap `<SegmentGroupItem>` elements, providing the group-level accessible label while each item carries its own value and checked state.

## References

- WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
- WAI-ARIA Authoring Practices - Toolbar: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/
