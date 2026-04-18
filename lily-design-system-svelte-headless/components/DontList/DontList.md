# DontList

A don't list presents discouraged actions or practices to
avoid as a list of items. It is used in design system documentation, guidelines,
and instructional content to clearly communicate what users or developers should
not do. The list is paired with the DoList component to create do/don't guidance
patterns.

This component renders a semantically labeled ordered list (`<ol>`) with
`role="list"` to ensure assistive technology announces it as a list even when
CSS may remove default list semantics. The default label is "Don't", making it
immediately usable without configuration.

## Implementation Notes

- Renders a `<ul>` element with explicit `role="list"` to preserve list semantics
- Uses `aria-label` to provide an accessible name (defaults to "Don't")
- Children snippet is rendered inside the list; each child should be an `<li>` element
- Label prop has a sensible default but can be overridden for internationalization
- Spreads `restProps` on the `<ul>` element

## Props

- `label`: string (default: `"Don't"`) -- accessible name for the list
- `children`: Snippet (required) -- list items, each should be an `<li>` element
- `...restProps`: any additional HTML attributes spread onto the `<ul>` element

## Usage

```svelte
<DontList>
    <li>Skip alt text</li>
    <li>Use only color for meaning</li>
</DontList>
```

```svelte
<DontList label="Avoid">
    <li>Hard-code user-facing strings</li>
    <li>Rely on placeholder text as labels</li>
    <li>Remove focus indicators</li>
</DontList>
```

## Keyboard Interactions

None -- this component is a passive container for list items.

## ARIA

- `role="list"` -- explicitly declares list semantics on the `<ul>`, ensuring assistive technology announces it as a list
- `aria-label={label}` -- provides an accessible name for the list (defaults to "Don't")

## References

- MDN ul element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul
- WAI list role: https://www.w3.org/WAI/ARIA/apd/roles/list/
