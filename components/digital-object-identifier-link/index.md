# Digital Object Identifier Link

A digital object identifier link is a permanent hyperlink for a Digital Object Identifier (DOI) to an electronic source. DOIs provide persistent, actionable identification for content objects in digital environments and are widely used in academic publishing, scientific journals, and digital libraries.

This headless component uses the native HTML `<a>` element for inherent link semantics. It constructs a DOI resolver URL (e.g., `https://doi.org/10.1234/example`) from the provided DOI string.

## Implementation Notes

- Renders an `<a>` element for hyperlink semantics
- Constructs the `href` from the DOI using the `https://doi.org/` resolver prefix
- `rel="noopener noreferrer"` for security when opening external links
- `target` can be set via restProps (e.g., `target="_blank"` for new tab)
- Consumer provides the display text as children, or the DOI is displayed by default
- Spreads `restProps` onto the `<a>` for consumer customization

## Props

- `doi`: string (required) -- the Digital Object Identifier (e.g., "10.1000/xyz123")
- `children`: slot (optional) -- link display text; defaults to the DOI string if not provided
- `...restProps`: unknown -- additional attributes spread onto the `<a>` element

## Usage

Basic DOI link:

```html
<DigitalObjectIdentifierLink doi="10.1000/xyz123" />
```

DOI link with custom display text:

```html
<DigitalObjectIdentifierLink doi="10.1000/xyz123">
  View the original paper
</DigitalObjectIdentifierLink>
```

DOI link opening in a new tab:

```html
<DigitalObjectIdentifierLink doi="10.1000/xyz123" target="_blank">
  10.1000/xyz123
</DigitalObjectIdentifierLink>
```

## Keyboard Interactions

- Tab: Focus the link
- Enter: Activate the link and navigate to the DOI URL

## ARIA

- Implicit `link` role from `<a>` element with `href`
- `aria-label` can be provided via restProps for additional context (e.g., "DOI link to Research Paper Title")
- External link indication can be added by the consumer

## When to Use

- Use to create a permanent hyperlink for a Digital Object Identifier (DOI) to an electronic source.
- Use for linking to academic papers, journal articles, datasets, and other digital objects identified by a DOI.
- Use in bibliographies, reference lists, and citation sections.
- Use in academic, research, or clinical evidence contexts.

## When Not to Use

- Do not use for non-DOI links -- use Citation for general references or ActionLink for navigation.
- Do not use for general-purpose hyperlinks -- use ActionLink or a standard `<a>` element instead.
- Do not use for non-DOI permanent identifiers -- use a standard link with the appropriate resolver.

## Headless

This component provides an `<a>` element with the DOI resolver URL as the `href`, with zero visual styling. The consumer is responsible for all CSS including link color, underline, hover states, focus indicators, and any external link icon.

## Styles

The consumer provides all CSS styling. The component renders with a `.digital-object-identifier-link` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders an `<a>` element with class `digital-object-identifier-link`
- Verify the `href` is correctly constructed from the DOI (e.g., `https://doi.org/10.1000/xyz123`)
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Style DOI links consistently with other citation links. Consider adding an external link icon to indicate the link opens an external resource. Ensure the link text is descriptive enough for context.
- **Developers**: Pass only the DOI identifier (e.g., "10.1000/xyz123"), not the full URL. The component constructs the full resolver URL automatically. Use `rel="noopener noreferrer"` when opening in a new tab.

## Domain Knowledge

A Digital Object Identifier (DOI) is a persistent identifier used to uniquely identify objects such as academic papers, datasets, and government reports. The DOI system is managed by the International DOI Foundation (IDF). DOIs are resolved via `https://doi.org/` followed by the DOI string. Example: `https://doi.org/10.1000/xyz123` resolves to the identified resource.

## References

- DOI Handbook: https://www.doi.org/hb.html
- MDN HTML a element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a
