# Picture

## Metadata

- Component: picture
- PascalCase: Picture
- Description: a responsive image wrapper that lets the browser choose among several sources, using the native picture element
- Status: beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows
- HTML tag: <picture>
- CSS class: .picture
- Interactive: no

## Key Behaviors

- Renders the native `<picture>` element with the base class `picture` first, then the consumer class
- The `<source>` and `<img>` children are the consumer's; the `<img>` carries `alt`, `width` and `height`
- Spreads `restProps` onto the root; no state, behaviour, ARIA or strings

## ARIA

- None added; the `<picture>` has no role and the `<img>` inside it is named by its `alt`
- Do not pass `aria-label` through rest props; it has nothing to name

## Keyboard

- None

## Props

- `class`: string (default: `""`) -- appended to the base class
- `children`: slot -- the `<source>` elements, then one `<img>`
- `...restProps`: HTML attributes -- spread onto the root `<picture>`

## Acceptance Criteria

- [ ] Renders <picture> with class="picture"
- [ ] Consumer class appended; rest props spread
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.picture` in css-style-sheet-template.css
- [MDN picture element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture)
