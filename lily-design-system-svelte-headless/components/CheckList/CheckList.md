# CheckList

A CheckList is a semantic list container for CheckList items, allowing users to track and manage tasks, options, or steps by marking items as completed or pending. Typically displayed as a list of actionable items, each with a checkbox that users can tick off as they progress, CheckLists are commonly used in to-do lists, forms, or onboarding processes.

The component renders a `<ul>` with `role="list"` and delegates item rendering to consumers, who provide `<li>` elements with checkboxes or other interactive controls. This headless approach lets consumers define all visual feedback such as checkmarks, color changes, or progress indicators through their own CSS.

## Implementation Notes

- Renders a semantic `<ul>` element with explicit `role="list"` to ensure list semantics are preserved across screen readers
- Supports an optional `aria-label` for an accessible name describing the CheckList purpose
- Consumers provide `<li>` children with checkboxes or other controls
- Spreads `restProps` for consumer customization

## Props

- `label`: string (default: undefined) -- accessible name for the CheckList via `aria-label`
- `children`: Snippet (required) -- list items to render inside the `<ul>`

## Usage

```svelte
<CheckList label="Onboarding tasks">
  <li><input type="checkbox" /> Create account</li>
  <li><input type="checkbox" /> Set up profile</li>
  <li><input type="checkbox" /> Invite team members</li>
</CheckList>
```

## Keyboard Interactions

None -- this component is a passive container. Keyboard interactions are determined by the consumer-provided child elements (e.g., checkboxes respond to Space).

## ARIA

- `role="list"` -- explicit list role on the `<ul>` ensures assistive technologies treat it as a list
- `aria-label` -- optional accessible name describing the purpose of the CheckList

## References

- WAI-ARIA Listbox Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/listbox/
