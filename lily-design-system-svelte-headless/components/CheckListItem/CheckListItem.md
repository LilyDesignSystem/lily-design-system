# CheckListItem

A single item within a CheckList. Renders as an `<li>` containing a checkbox `<input>` and a `<label>` for the item text.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| checked | boolean | false | Whether the checkbox is checked |
| disabled | boolean | false | Whether the checkbox is disabled |
| children | Snippet | required | Label content for this item |
| ...restProps | HTML attributes | — | Spread onto the `<li>` |

## Usage

```svelte
<CheckList label="Onboarding tasks">
  <CheckListItem checked>Create account</CheckListItem>
  <CheckListItem>Set up profile</CheckListItem>
  <CheckListItem disabled>Admin only</CheckListItem>
</CheckList>
```

## Accessibility

- Native `<input type="checkbox">` provides built-in keyboard and screen reader support
- `<label>` wraps checkbox and text for a larger click target
- `disabled` attribute prevents interaction when set

## References

- [MDN checkbox](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox)
