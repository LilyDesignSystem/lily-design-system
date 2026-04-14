# Contents List Item

A contents list item is a single entry within a table of contents or navigation list. It renders as a semantic list item (`<li>`) that typically contains a link to a section of a page or document.

Contents list items are used as children of ordered or unordered lists within a table of contents component. They support nesting for hierarchical document structures where sections contain subsections. The consumer provides the content (usually an anchor link with descriptive text) through the children slot, and can add `aria-current` attributes to indicate the currently active section.

## Implementation Notes

- Renders as a semantic `<li>` element for use in contents/navigation lists
- All content is provided through the children slot (typically links)
- Supports nesting by placing a `<ul>` inside a ContentsListItem
- Should be placed inside a `<ul>` or `<ol>` parent element for valid HTML
- Spreads `...restProps` onto the `<li>` element for consumer customization

## Props

- `children`: slot (required) -- list item content, typically a link or nested list
- `...restProps`: Any additional HTML attributes spread onto the `<li>`

## Usage

```html
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
</ContentsList>
```

## Keyboard Interactions

- None directly -- keyboard interaction is handled by contained links or the parent list

## ARIA

- Semantic `<li>` provides implicit `listitem` role
- Supports `aria-current="page"` or `aria-current="true"` on the `<li>` for indicating the current page in a navigation context

## When to Use

- Use inside ContentsList to represent one page in the contents navigation.
- Use with `aria-current="page"` on the item representing the current page.

## When Not to Use

- Do not use outside of ContentsList -- it has no standalone meaning.
- Do not render the current page as a link -- display it as plain text with `aria-current="page"`.

## Headless

This headless ContentsListItem component provides a semantic `<li>` element with support for `aria-current` and nesting. The consumer provides all visual styling including link appearance, active-section highlighting, indentation for nested items, and hover/focus states.


## Styles

The consumer provides all CSS styling. The component renders with a `.contents-list-item` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<li>` element with class `contents-list-item`
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Highlight the currently active section link to help users orient themselves on long pages. Use consistent indentation for nested subsections.
- **Developers**: Set `aria-current="true"` on the active item to communicate the current section to screen readers. Nest a `<ul>` inside a ContentsListItem to create subsection levels.

## Composition

ContentsListItem is the child component in the ContentsNav/ContentsList/ContentsListItem composition pattern. Place ContentsListItem components inside a ContentsList. Each item typically contains an anchor link. For hierarchical structures, nest a `<ul>` with additional ContentsListItem components inside a parent item.
