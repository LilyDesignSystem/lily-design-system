# AccordionList

A grouping container for AccordionListItem elements within an AccordionNav. Renders a `<div>` with `role="group"` to semantically group the set of disclosure widgets.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | string | "" | Optional accessible name for the group via aria-label |
| children | Snippet | required | AccordionListItem elements |
| ...restProps | HTML attributes | — | Spread onto the `<div>` |

## Usage

```svelte
<AccordionNav label="FAQ">
  <AccordionList label="Questions">
    <AccordionListItem>
      <summary>What is this?</summary>
      <p>A design system.</p>
    </AccordionListItem>
  </AccordionList>
</AccordionNav>
```

## Accessibility

- `role="group"` semantically groups the disclosure widgets
- `aria-label` optionally provides an accessible name for the group

## References

- [WAI-ARIA group role](https://www.w3.org/TR/wai-aria-1.2/#group)
