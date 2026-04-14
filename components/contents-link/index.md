# ContentsLink

A contents link is a single navigation link within a contents list, typically linking to a page or page section. Contents links are used in tables of contents, page outlines, and section navigation.

This headless component uses an `<a>` element for native link semantics and keyboard navigation, with `aria-current` support for indicating the currently active section.

## Implementation Notes

- Uses native `<a>` element for inherent link behavior and keyboard support
- `aria-current="true"` indicates the currently active or visible section
- `href` attribute links to the target page or section anchor
- Content is provided through child elements

## Props

- `href`: string (required) -- the URL or anchor the link points to
- `current`: boolean (default: false) -- whether this is the currently active section
- `children`: slot (required) -- link text content
- `...restProps`: Any additional HTML attributes

## Usage

```html
<ContentsNav label="Pages in this guide">
  <ContentsList>
    <ContentsListItem aria-current="page">
      What is type 2 diabetes?
    </ContentsListItem>
    <ContentsListItem>
      <ContentsLink href="/conditions/type-2-diabetes/symptoms">Symptoms</ContentsLink>
    </ContentsListItem>
    <ContentsListItem>
      <ContentsLink href="/conditions/type-2-diabetes/getting-diagnosed">Getting diagnosed</ContentsLink>
    </ContentsListItem>
    <ContentsListItem>
      <ContentsLink href="/conditions/type-2-diabetes/treatment">Treatment</ContentsLink>
    </ContentsListItem>
  </ContentsList>
</ContentsNav>
```

## Keyboard Interactions

- Tab: Focus the link
- Enter: Follow the link
- (All handled natively by `<a>` element)

## ARIA

- Implicit `link` role from `<a>` element
- `aria-current="true"` when the link corresponds to the currently visible section

## When to Use

- Use inside ContentsListItem to create a clickable link to a related page in the guide.
- Use concise, descriptive link text limited to approximately two lines.

## When Not to Use

- Do not use for the current page -- the current page should be plain text, not a link.
- Do not use outside of ContentsListItem -- use ActionLink or a standard anchor for standalone links.

## Headless

This component provides a native `<a>` element with `aria-current` support for active section indication, with zero visual styling. The consumer is responsible for all CSS including text color, hover state, active/current indicator, and focus styling.

## Styles

The consumer provides all CSS styling. The component renders with a `.contents-link` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders an `<a>` element with class `contents-link`
- Verify `href` attribute is applied
- Verify `aria-current` is set when `current` is true
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Visually distinguish the current section link from others. Use indentation to show section hierarchy. Ensure sufficient contrast for link text.
- **Developers**: Update `aria-current` dynamically as the user scrolls through sections for accurate screen reader announcements.

## Composition

ContentsLink is used within ContentsListItem, which is part of ContentsList and ContentsNav.
