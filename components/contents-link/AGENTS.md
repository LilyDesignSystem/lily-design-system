# ContentsLink

## Metadata

- Component: contents-link
- PascalCase: ContentsLink
- Description: one table of contents link
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <a>
- CSS class: .contents-link
- Interactive: yes

## Key Behaviors

- Uses native `<a>` element for inherent link behavior and keyboard support
- `aria-current="true"` indicates the currently active or visible section
- `href` attribute links to the target page or section anchor
- Fine for same-page links (local anchors such as `#symptoms`) and as a same-page "scrollspy" entry: inside a `ContentsNav` with `spy`, the link for the section in view gets `aria-current="true"`; on a same-page outline every entry stays a link, including the current one
- **Count (optional)**: `countLabel` renders a visible, localised count (for example "3 to do") in a
  `<span class="contents-link-count">` *inside* the link, after the text, so the link's accessible name includes it.
  `count` sets `data-count` on the link (and `data-complete` when it is 0) as CSS hooks. The count is text, never colour
  alone (WCAG 1.4.1). Lily ships no default text: the consumer supplies the whole phrase, so plural forms and languages
  stay theirs
- An `aria-label` (`label`) replaces the link's whole accessible name; if you set one and show a count, include the count in it

## ARIA

- Implicit `link` role from `<a>` element
- `aria-current="true"` when the link corresponds to the currently visible section

## Keyboard

- Tab: Focus the link
- Enter: Follow the link

## Props

- `href`: string (required) -- the URL or anchor the link points to
- `current`: boolean (default: false) -- whether this is the currently active section
- `count`: number -- tasks (or items) to show a count for; sets `data-count`, and `data-complete` when 0
- `countLabel`: string -- visible, localised count text, rendered inside the link after the text
- `children`: slot (required) -- link text content
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <a> element with class="contents-link"
- [ ] Has href attribute
- [ ] Has aria-current attribute when current
- [ ] With `countLabel`, the count is a `.contents-link-count` span inside the `<a>`; `count` sets `data-count` (and `data-complete` at 0)
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .contents-link in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/contents-link.html
