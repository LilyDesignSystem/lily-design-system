# GoToTop

## Metadata

- Component: go-to-top
- PascalCase: GoToTop
- Description: a link that returns users to the top of a long page
- HTML tag: <a>
- CSS class: .go-to-top
- Interactive: yes

## Key Behaviors

- Renders a single `<a>` linking to a target anchor at the top of the page (default `#top` or `#main-content`)
- The `href` is configurable so consumers can target any element with an `id`
- Native anchor behaviour scrolls the page; consumers may layer smooth-scroll JavaScript on top without losing the keyboard / no-JS fallback
- Spreads `restProps` onto the root `<a>` element

## ARIA

- Native anchor accessibility — the visible text plus the destination provide the accessible name
- Consumers can override the accessible name with `aria-label` when the visible text is decorative (e.g. just an arrow icon)

## Keyboard

- Tab moves focus onto the link
- Enter activates the link and scrolls to the target (native browser behaviour)

## Props

- `href`: string (default: "#top") -- anchor target on the current page
- `label`: string (required) -- visible link text
- `...restProps`: HTML attributes spread onto the root `<a>`

## Acceptance Criteria

- [ ] Renders <a> element with class="go-to-top"
- [ ] Activating the link scrolls focus to the target
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.go-to-top` in css-style-sheet-template.css
- MDN anchor element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a
