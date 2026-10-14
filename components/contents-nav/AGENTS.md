# ContentsNav

## Metadata

- Component: contents-nav
- PascalCase: ContentsNav
- Description: a contents navigation area
- Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks
- HTML tag: <nav>
- CSS class: .contents-nav
- Interactive: no, unless `spy` is set (then it observes scrolling and marks the current link; it still has no keyboard behaviour of its own)

## Composition

- Pattern: Nav/List/ListItem
- Children: contents-list, contents-list-item

## Key Behaviors

- Renders a `<nav>` element with `aria-label` for accessible landmark identification
- Contains an `<ol>` (ordered list) to convey the sequential nature of page sections
- Children slot is rendered inside the ordered list
- Label prop is required for accessibility, distinguishing this navigation from others on the page
- Spreads `restProps` on the outer `<nav>` element
- This is a compound component; use with ContentsListItem for individual entries
- **Scrollspy (`spy`)**: when set, the component marks the link of the section currently in view. The links are the
  consumer's own `<a href="#id">` elements inside the nav; the targets are the elements with those ids. The current section
  is the last one whose top has passed the activation line (`offset` px below the top of `root`, default the viewport);
  at the bottom of the scroll range the last section is current; before the first, the first. The URL hash wins on load.
- A click makes its link current at once and holds it until the scroll settles (`scrollend`, or 1 s), so a smooth scroll
  passing through other sections cannot steal the mark
- Lily never animates scrolling, never moves focus on scroll, and never touches the URL; links with no matching element are ignored

## ARIA

- `aria-label={label}` -- provides an accessible name for the `<nav>` landmark, distinguishing it from other navigation regions on the page
- With `spy`: `aria-current="{current}"` on the one active link (default `"true"`; there is no live region, so scrolling announces nothing)

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible name for the navigation landmark (e.g., "Contents", "On this page")
- `children`: slot (required) -- list items, typically ContentsListItem components or `<li>` elements with links
- `spy`: boolean, default false -- turn scrollspy on
- `offset`: number (px), default 0 -- the activation line below the top of `root`; set it to a fixed header's height, matching the targets' `scroll-margin-top`
- `root`: element or null, default null (the viewport) -- a scrolling element other than the viewport
- `current`: string, default `"true"` -- the `aria-current` token set on the active link
- `active`: string, bindable -- the id of the section in view (spy only)
- `onActiveChange`: `(id) => void` -- called once per change
- `...restProps`: any additional HTML attributes spread onto the `<nav>` element

## Data attributes (spy)

- `data-active` on the active link; `data-descendant-active` on each `<li>` that holds the active link but is not its own entry (so a parent can stay open)

## Acceptance Criteria

- [ ] Renders <nav> element with class="contents-nav"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] With `spy`, exactly one link carries `aria-current` and `data-active`: the last section past the line, the last at the bottom, the first before the first
- [ ] A click holds its link until the scroll settles; the URL hash wins on load; links with no target are ignored

## References

- Documentation: index.md
- CSS class: .contents-nav in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/contents-nav.html
- WAI-ARIA Navigation Landmark: https://www.w3.org/WAI/ARIA/apd/practices/landmark-regions/
- MDN nav element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav
