# Contents Nav

A contents list provides a table-of-contents navigation with ordered links to page sections. It helps users quickly scan and jump to different parts of a long page, improving navigation and content discoverability.

**Status:** stable — exercised in composed page flows under e2e and axe, beyond the per-component checks.

This component is commonly used at the top of documentation pages, articles, or forms with multiple sections. It renders a semantic `<nav>` landmark with an ordered list, making the hierarchical structure clear to both visual users and assistive technology. Use ContentsListItem components or `<li>` elements as children.

## Implementation Notes

- Renders a `<nav>` element with `aria-label` for accessible landmark identification
- Contains an `<ol>` (ordered list) to convey the sequential nature of page sections
- Children slot is rendered inside the ordered list
- Label prop is required for accessibility, distinguishing this navigation from others on the page
- Spreads `restProps` on the outer `<nav>` element
- This is a compound component; use with ContentsListItem for individual entries

## Props

- `label`: string (required) -- accessible name for the navigation landmark (e.g., "Contents", "On this page")
- `children`: slot (required) -- list items, typically ContentsListItem components or `<li>` elements with links
- `...restProps`: any additional HTML attributes spread onto the `<nav>` element

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

None -- this component is a passive navigation container. Keyboard navigation is handled natively by the anchor links within list items.

## ARIA

- `aria-label={label}` -- provides an accessible name for the `<nav>` landmark, distinguishing it from other navigation regions on the page

## When to Use

- Use at the top of a page to help users navigate a small group of related pages, such as pages about a health condition.
- Use for collections of up to 8 related pages -- the mini-hub pattern pairs this with PaginationNav at the bottom.
- Use with `aria-label` to describe the navigation purpose, such as "Pages in this guide".

## When Not to Use

- Do not use for unrelated pages that are not part of a cohesive group -- it will confuse users.
- Do not use for hierarchical site navigation -- use BreadcrumbNav instead.
- Do not use for in-page section links on a single long page -- use anchor links with a table of contents pattern.
- Do not use within multi-page forms -- use Button with BackLink for form step navigation.

## Headless

This headless ContentsNav component provides a semantic `<nav>` element with `aria-label` for landmark identification, containing an `<ol>` for ordered section links. The consumer provides all visual styling including positioning (sticky sidebar or inline), borders, spacing, and link appearance.


## Styles

The consumer provides all CSS styling. The component renders with a `.contents-nav` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<nav>` element with class `contents-nav`
- Verify aria-label={label}` -- provides an accessible name for the `<nav>` landmark, distinguishing it from other navigation regions on the page
- Verify pass-through attributes are applied

## Advice

- **Designers**: Place the contents navigation in a consistent location, such as the top of the content area or a sticky sidebar. Ensure it is visually distinct from the main navigation.
- **Developers**: Set the `label` prop to a descriptive name (e.g., "On this page") to differentiate this landmark from other `<nav>` elements. Use ContentsList and ContentsListItem as children.

## Composition

ContentsNav follows the Nav/List/ListItem composition pattern. Use ContentsNav as the outer `<nav>` landmark, ContentsList as the inner ordered list, and ContentsListItem for each section link entry. This three-level structure ensures proper semantics and landmark navigation for assistive technology users.

## Related components

- `contents-list` — an contents ordered list of contents list item components
- `contents-list-item` — one contents list item
- `contents-link` — one table of contents link

## References

- WAI-ARIA Navigation Landmark: https://www.w3.org/WAI/ARIA/apd/practices/landmark-regions/
- MDN nav element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav

---

Lily™ and Lily Design System™ are trademarks.

## Scrollspy

`spy` marks the table-of-contents link for the section the reader is in. It is a behaviour of this one component in every
library; the links are your own `<a href="#id">` elements and the targets are the elements with those ids.

- **Which section is current:** the last one whose top has passed the activation line (`offset` px below the top of the
  scroller). At the bottom of the page the last section is current; above the first section, the first is.
- **What is set:** `aria-current` (default `"true"`) and `data-active` on that link, and `data-descendant-active` on each
  enclosing `<li>`. Style the highlight with more than colour (WCAG 1.4.1). There is no live region: scrolling announces nothing.
- **Clicks:** the clicked link becomes current at once and stays so until the scroll settles (`scrollend`, or 1 s).
- **Not done for you:** smooth scrolling (CSS `scroll-behavior` inside `prefers-reduced-motion: no-preference`), a fixed
  header's offset (`scroll-margin-top` on the targets plus the same `offset`), moving focus, and updating the URL.

Per library:

- **Svelte:** `<ContentsNav spy offset={64} bind:active onActiveChange={...}>`.
- **React:** `<ContentsNav spy offset={64} onActiveChange={...}>`.
- **Vue:** `<ContentsNav spy :offset="64" v-model:active="section">`.
- **Angular:** `<lily-contents-nav [spy]="true" [offset]="64" [(active)]="section">`.
- **Web Components:** `<lily-contents-nav label="On this page" spy offset="64" root="#pane">`; fires `lily-active-change` with `{ id }`.
- **HTML:** `startScrollspy(nav, { offset, root, current, onChange })` from `components/contents-nav-spy.js`.
- **Nunjucks:** `spy: true, spyOffset: 64` renders data attributes; `components/contents-nav/spy.js` `autoInit()` does the work.
- **Blazor:** `Spy="true" SpyOffset="64"` renders data attributes; load `_content/LilyDesignSystem.Blazor.Headless/contents-nav-spy.js` and call `autoInit()`. The component is not told which section is active.

Verification: the HTML library proves the algorithm in real Chrome (`contents-nav-spy.test.js`: scrolling, bottom of page, click
lock, hash on load, offset, nesting); the other libraries test with mocked layout, since jsdom has none.
