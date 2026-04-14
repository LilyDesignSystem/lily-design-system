# CheckListItem

A check list item is a single item within a check list that includes a checkbox, allowing users to mark items as complete or incomplete. Check list items are commonly used in task lists, to-do lists, and checklists for tracking progress.

This headless component uses a `<li>` element containing a checkbox input, providing inherent list semantics and accessible state management.

## Implementation Notes

- Uses `<li>` element for proper list semantics within a CheckList
- Contains a checkbox input for toggling completion state
- `aria-checked` reflects the current checked state
- Label text is associated with the checkbox for accessibility

## Props

- `checked`: boolean (default: false) -- whether the item is checked
- `disabled`: boolean (default: false) -- whether the checkbox is disabled
- `label`: string (optional) -- accessible label override
- `onchange`: callback (optional) -- change handler
- `children`: slot -- item content
- `...restProps`: Any additional HTML attributes

## Usage

Checklist with completed, pending, and disabled items:

```html
<CheckList label="Daily tasks">
    <CheckListItem checked={true}>Buy groceries</CheckListItem>
    <CheckListItem>Clean the house</CheckListItem>
    <CheckListItem disabled>Optional task</CheckListItem>
</CheckList>
```

Checklist item with change handler:

```html
<CheckListItem checked={isComplete} onchange={handleToggle}>
    Review pull request
</CheckListItem>
```

## Keyboard Interactions

- Tab: Focus the checkbox
- Space: Toggle the checkbox state
- (Handled natively by the checkbox input)

## ARIA

- Implicit `listitem` role from `<li>` element
- `aria-checked` reflects the current state of the checkbox
- Label association via `<label>` element or `aria-label`

## When to Use

- Use inside CheckList to represent one checkable item.
- Use when users need to mark items as complete or incomplete.
- Use for task tracking, progress checklists, or completion workflows.

## When Not to Use

- Do not use outside CheckList -- it requires a parent `<ul>` or `<ol>` context.
- Do not use for form checkboxes in a submission flow -- use CheckboxInput instead.
- Do not use for non-actionable informational list items -- use a standard `<li>` instead.

## Headless

This component provides a `<li>` element with an associated checkbox input and label, with zero visual styling. The consumer is responsible for all CSS including checkbox appearance, checked/unchecked states, strikethrough text, spacing, and disabled appearance.

## Styles

The consumer provides all CSS styling. The component renders with a `.check-list-item` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<li>` element with class `check-list-item`
- Verify the checkbox input is present and toggleable
- Verify `aria-checked` reflects the current state
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use visual indicators (strikethrough, opacity change) to distinguish checked from unchecked items. Maintain sufficient touch targets for the checkbox.
- **Developers**: Ensure the checkbox is properly associated with its label text for screen reader accessibility.

## Composition

CheckListItem is used within a CheckList component.
