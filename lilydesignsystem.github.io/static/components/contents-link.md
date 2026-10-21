# ContentsLink

A contents link is a single navigation link within a contents list, typically linking to a page or page section. Contents links are used in tables of contents, page outlines, and section navigation.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

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
- Use it for same-page links, such as local anchors (`href="#symptoms"`): a page outline that jumps to the sections of the page being read is a fine use.
- Use it as a same-page "scrollspy": inside a `ContentsNav` with `spy`, the link for the section in view is marked `aria-current="true"` as the reader scrolls, so the outline always shows where they are.

## When Not to Use

- Do not use for the current page when the list links *between pages* -- there the current page should be plain text, not a link. (A same-page outline is different: its links point at anchors on this page, so every entry, including the section in view, stays a link and the section in view carries `aria-current="true"`.)
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
- **Developers**: For a same-page outline, give each section an `id` and point the links at them (`#id`); native anchors keep working without JavaScript and the scrollspy only adds the current marker. Update `aria-current` dynamically as the user scrolls through sections for accurate screen reader announcements.

## Composition

ContentsLink is used within ContentsListItem, which is part of ContentsList and ContentsNav.

## Related components

- `contents-nav` — a contents navigation area
- `contents-list` — an contents ordered list of contents list item components
- `contents-list-item` — one contents list item

## References

- [MDN a element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a)

---

Lily™ and Lily Design System™ are trademarks.

## Count

Show how many things need doing in a section by adding `countLabel`. It is rendered inside the link, after the text, so the
link's accessible name includes it ("Address 3 to do"); `count` adds `data-count` (and `data-complete` at 0) for styling.
You supply the whole phrase, so plurals and languages are yours; the count is text, never colour alone (WCAG 1.4.1).
An `aria-label` replaces the whole name, so if you set one, include the count in it.

- **Svelte:** `<ContentsLink href="#address" count={3} countLabel="3 to do">Address</ContentsLink>`
- **React:** `<ContentsLink href="#address" count={3} countLabel="3 to do">Address</ContentsLink>`
- **Vue:** `<ContentsLink href="#address" :count="3" count-label="3 to do">Address</ContentsLink>`
- **Angular:** `<lily-contents-link href="#address" [count]="3" countLabel="3 to do">Address</lily-contents-link>`
- **Web Components:** `<lily-contents-link href="#address" count="3" count-label="3 to do">Address</lily-contents-link>`
- **HTML:** `<a class="contents-link" href="#address" data-count="3">Address <span class="contents-link-count">3 to do</span></a>`
- **Nunjucks:** `contentsLink({ href: "#address", text: "Address", count: 3, countLabel: "3 to do" })`
- **Blazor:** `<ContentsLink Href="#address" Count="3" CountLabel="3 to do">Address</ContentsLink>`

For a left-hand list of page sections with counts, use `ContentsNav` (with `spy`, to mark the section in view) containing
`ContentsLink`s that carry a `countLabel`.
