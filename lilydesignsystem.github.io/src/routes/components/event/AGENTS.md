# Event

## Metadata

- Component: event
- PascalCase: Event
- Description: an event component that contains other event-related information
- HTML tag: <article>
- CSS class: .event
- Interactive: no

## Key Behaviors

- Uses `<article>` element for self-contained event semantics
- `aria-label` describes the event for screen readers
- Contains slots for title, date, time, location, and description

## ARIA

- Implicit `article` role from `<article>` element
- `aria-label` -- describes the event for screen readers

## Keyboard

- None -- events are informational, not interactive

## Props

- `label`: string (optional) -- accessible label for the event
- `children`: slot (required) -- event content
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <article> element with class="event"
- [ ] Has aria-label attribute when provided
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .event in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/event.html
