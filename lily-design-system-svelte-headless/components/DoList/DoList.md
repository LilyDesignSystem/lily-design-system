# DoList

A do list presents recommended actions or best practices as a list of items. It
is used in design system documentation, guidelines, and instructional content to
clearly communicate what users or developers should do. The list is paired with
the DontList component to create do/don't guidance patterns.

This component renders a semantically labeled ordered list (`<ol>`) with
`role="list"` to ensure assistive technology announces it as a list even when
CSS may remove default list semantics. The default label is "Do", making it
immediately usable
without configuration.

## Implementation Notes

- Renders a `<ul>` element with explicit `role="list"` to preserve list semantics
- Uses `aria-label` to provide an accessible name (defaults to "Do")
- Children snippet is rendered inside the list; each child should be an `<li>` element
- Label prop has a sensible default but can be overridden for internationalization
- Spreads `restProps` on the `<ul>` element

## Props

- `label`: string (default: `"Do"`) -- accessible name for the list
- `children`: Snippet (required) -- list items, each should be an `<li>` element
- `...restProps`: any additional HTML attributes spread onto the `<ul>` element

## Usage

```svelte
<DoList>
    <li>Write clear labels</li>
    <li>Use semantic HTML</li>
</DoList>
```

```svelte
<DoList label="Recommended">
    <li>Provide alt text for images</li>
    <li>Use sufficient color contrast</li>
    <li>Test with keyboard navigation</li>
</DoList>
```

## Keyboard Interactions

None -- this component is a passive container for list items.

## ARIA

- `role="list"` -- explicitly declares list semantics on the `<ul>`, ensuring assistive technology announces it as a list
- `aria-label={label}` -- provides an accessible name for the list (defaults to "Do")

## References

- MDN ul element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul
- WAI list role: https://www.w3.org/WAI/ARIA/apd/roles/list/
