# Scroller

## Metadata

- Component: scroller
- PascalCase: Scroller
- Description: a scrollytelling container with step-based foreground and background composition
- HTML tag: <div>
- CSS class: .scroller
- Interactive: yes

## Key Behaviors

- Background content sticks in viewport while foreground steps scroll over it
- Current step index drives background content changes
- Builds on ScrollerBase primitive
- Background uses position: sticky; foreground overlays with pointer-events: none on non-interactive areas
- Steps can contain any content (text, images, charts)
- Inspired by Reuters Graphics Scroller component

## ARIA

- `aria-label` on container
- `aria-live="polite"` on background for screen reader updates

## Keyboard

- Standard scroll behavior
- Tab navigates focusable content within steps

## Props

- `children`: slot (required) -- foreground step content
- `background`: slot (required) -- sticky background content that changes with steps
- `offset`: number (default: 0.5) -- viewport offset where step triggers
- `index`: number (bindable, default: 0) -- current active step index
- `progress`: number (bindable, default: 0) -- overall scroll progress (0-1)
- `label`: string (optional) -- accessible label for the scroller region
- `...restProps`: Any additional HTML attributes

## Composition

- Uses ScrollerBase internally as the scroll-tracking primitive

## Acceptance Criteria

- [ ] Renders <div> element with class="scroller"
- [ ] Has aria-label attribute when label prop is provided
- [ ] Background content sticks while foreground scrolls
- [ ] Exposes bindable index and progress values
- [ ] Uses ScrollerBase internally
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .scroller in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/scroller.html
- Reuters Graphics Scroller
- Scrollytelling best practices
