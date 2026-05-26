# Visible

## Metadata

- Component: visible
- PascalCase: Visible
- Description: an IntersectionObserver wrapper that exposes element visibility state
- HTML tag: <div>
- CSS class: .visible
- Interactive: no

## Key Behaviors

- Wraps content and tracks whether element is in viewport using IntersectionObserver
- Passes visibility boolean to children slot/render prop
- `once` mode disconnects observer after first intersection (for lazy loading)
- Consumer uses visibility state for lazy loading, animations, analytics

## ARIA

- None -- presentational wrapper

## Keyboard

- None

## Props

- `children`: slot (required) -- receives visibility boolean (e.g., `children(visible)`)
- `once`: boolean (default: false) -- if true, stops observing after first visibility
- `threshold`: number (default: 0) -- IntersectionObserver threshold (0-1)
- `rootMargin`: string (default: "0px") -- IntersectionObserver root margin
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> element with class="visible"
- [ ] Uses IntersectionObserver to track viewport visibility
- [ ] Passes visibility boolean to children slot
- [ ] `once` mode disconnects observer after first intersection
- [ ] Supports configurable threshold and rootMargin
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .visible in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/visible.html
- Reuters Graphics Visible component
- IntersectionObserver API
