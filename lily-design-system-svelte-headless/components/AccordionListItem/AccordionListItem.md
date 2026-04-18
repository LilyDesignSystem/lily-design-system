# AccordionListItem

A single expandable section within an AccordionList, using the native HTML `<details>` element for built-in disclosure behavior. The consumer provides a `<summary>` element and content as children.

The `open` prop is two-way bindable, allowing parent components to programmatically control and observe the expanded state.

## Props

| Prop         | Type            | Default  | Description                             |
| ------------ | --------------- | -------- | --------------------------------------- |
| open         | boolean         | false    | Whether the item is expanded (bindable) |
| children     | Snippet         | required | A `<summary>` and content elements      |
| ...restProps | HTML attributes | —        | Spread onto the `<details>`             |

## Usage

```svelte
<AccordionListItem>
  <summary>Question</summary>
  <p>Answer</p>
</AccordionListItem>
```

```svelte
<AccordionListItem bind:open={isOpen}>
  <summary>Details</summary>
  <p>Expanded content here.</p>
</AccordionListItem>
```

## Keyboard

- Tab: Focus the summary element
- Enter / Space: Toggle open/close (browser native)

## Accessibility

- Native `<details>` provides implicit disclosure widget semantics
- Browser automatically manages expanded/collapsed state announcement

## References

- [HTML details element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details)
