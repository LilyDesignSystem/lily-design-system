# Check List

A checklist is a semantic list container for checklist items, allowing users to track and manage tasks, options, or steps by marking items as completed or pending. Typically displayed as a list of actionable items, each with a checkbox that users can tick off as they progress, checklists are commonly used in to-do lists, forms, or onboarding processes.

The component renders a `<ul>` with `role="list"` and delegates item rendering to consumers, who provide `<li>` elements with checkboxes or other interactive controls. This headless approach lets consumers define all visual feedback such as checkmarks, color changes, or progress indicators through their own CSS.

## Implementation Notes

- Renders a semantic `<ul>` element with explicit `role="list"` to ensure list semantics are preserved across screen readers
- Supports an optional `aria-label` for an accessible name describing the checklist purpose
- Consumers provide `<li>` children with checkboxes or other controls
- Spreads `restProps` for consumer customization

## Props

- `label`: string (default: undefined) -- accessible name for the checklist via `aria-label`
- `children`: slot (required) -- list items to render inside the `<ul>`

## Usage

Onboarding checklist with CheckListItem children:

```html
<CheckList label="Onboarding tasks">
    <CheckListItem checked={accountCreated}>Create account</CheckListItem>
    <CheckListItem checked={profileSetUp}>Set up profile</CheckListItem>
    <CheckListItem>Invite team members</CheckListItem>
</CheckList>
```

Packing list with completed and pending items:

```html
<CheckList label="Packing list">
    <CheckListItem checked={true}>Passport</CheckListItem>
    <CheckListItem checked={true}>Boarding pass</CheckListItem>
    <CheckListItem>Charger</CheckListItem>
    <CheckListItem>Headphones</CheckListItem>
</CheckList>
```

## Keyboard Interactions

None -- this component is a passive container. Keyboard interactions are determined by the consumer-provided child elements (e.g., checkboxes respond to Space).

## ARIA

- `role="list"` -- explicit list role on the `<ul>` ensures assistive technologies treat it as a list
- `aria-label` -- optional accessible name describing the purpose of the checklist

## When to Use

- Use for a list of items with checkboxes for tracking completion.
- Use for simple checklists without linked task pages, such as to-do lists or onboarding flows.
- Use when users need to see progress through a series of actionable items.
- Use for packing lists, grocery lists, or pre-flight safety checks.

## When Not to Use

- Do not use for complex multi-session task tracking -- use TaskList instead.
- Do not use for boolean form selections that require submission -- use CheckboxGroup instead.
- Do not use for non-actionable informational lists -- use a standard `<ul>` or ContentsList instead.

## Headless

This headless CheckList component provides a semantic `<ul>` with explicit `role="list"` and optional `aria-label` for accessible identification. The consumer provides all visual styling including checkmark indicators, strikethrough effects, progress visualization, spacing, and color changes for completed items.


## Styles

The consumer provides all CSS styling. The component renders with a `.check-list` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<ol>` element with class `check-list`
- Verify role="list"` -- explicit list role on the `<ul>` ensures assistive technologies treat it as a list
- Verify aria-label` -- optional accessible name describing the purpose of the checklist
- Verify pass-through attributes are applied

## Advice

- **Designers**: Provide clear visual distinction between completed and pending items, such as strikethrough text or a filled checkmark. Show overall progress when appropriate.
- **Developers**: Use CheckListItem components as children. Manage checkbox state externally and pass it to each item for consistent state tracking.

## Composition

CheckList follows the List/ListItem composition pattern. Use CheckList as the container with CheckListItem components as children. Each CheckListItem renders as an `<li>` and should contain a checkbox input and label. The CheckList manages the accessible list semantics while each CheckListItem manages its own item semantics.

## References

- WAI-ARIA Listbox Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/listbox/
