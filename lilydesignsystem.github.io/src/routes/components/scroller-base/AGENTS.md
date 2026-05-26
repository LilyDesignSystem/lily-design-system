# ScrollerBase

## Metadata

- Component: scroller-base
- PascalCase: ScrollerBase
- Description: a low-level scroll position tracking primitive for scrollytelling
- HTML tag: <div>
- CSS class: .scroller-base
- Interactive: yes

## Key Behaviors

- Tracks scroll position using IntersectionObserver
- Exposes current step index and overall progress as bindable values
- Steps are child elements; each child becomes a scrollytelling step
- Consumer uses index/progress to drive visual changes
- Inspired by Reuters Graphics ScrollerBase component

## ARIA

- `aria-label` for the scrollable region
- Steps should have appropriate roles

## Keyboard

- Standard scroll behavior
- Tab navigates between focusable step content

## Props

- `children`: slot (required) -- scrollable content
- `offset`: number (default: 0.5) -- viewport offset (0-1) where step triggers (0=top, 0.5=center, 1=bottom)
- `index`: number (bindable, default: 0) -- current active step index
- `progress`: number (bindable, default: 0) -- overall scroll progress (0-1)
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> element with class="scroller-base"
- [ ] Has aria-label attribute
- [ ] Tracks scroll position via IntersectionObserver
- [ ] Exposes bindable index and progress values
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .scroller-base in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/scroller-base.html
- Reuters Graphics ScrollerBase
- IntersectionObserver API
