# Event

An event component displays event-related information such as the event title, date, time, location, and description. Events are used in calendars, schedules, timelines, and event listing pages.

This headless component uses an `<article>` element for self-contained event content semantics, with appropriate ARIA attributes for accessible event identification.

## Implementation Notes

- Uses `<article>` element for self-contained event semantics
- `aria-label` describes the event for screen readers
- Contains slots for title, date, time, location, and description
- Supports structured event metadata

## Props

- `label`: string (optional) -- accessible label for the event
- `children`: slot (required) -- event content including title, date, location, etc.
- `...restProps`: Any additional HTML attributes

## Usage

```html
<Event label="Cardiology Outpatient Appointment, 15 March 2026">
  <h3>Cardiology Outpatient Appointment</h3>
  <time datetime="2026-03-15T09:30">15 March 2026, 09:30</time>
  <p>Room 204, Outpatient Wing, St James's Hospital</p>
  <p>Follow-up consultation with Dr Sarah Chen. Bring recent blood test results.</p>
</Event>
```

```html
<Event label="Team Retrospective, 22 April 2026">
  <h3>Team Retrospective</h3>
  <time datetime="2026-04-22T14:00">22 April 2026, 14:00 -- 15:00</time>
  <p>Conference Room B, Level 3</p>
  <p>Sprint 12 review and planning for next iteration.</p>
</Event>
```

## Keyboard Interactions

- None -- events are informational, not interactive

## ARIA

- Implicit `article` role from `<article>` element
- `aria-label` -- describes the event for screen readers

## When to Use

- Use to display event information such as appointments, conferences, or scheduled activities.
- Use when event metadata (date, time, location) needs structured semantic presentation.
- Use for calendar entries, schedule listings, and appointment summaries.
- Use with semantic `<time>` elements for machine-readable dates.
- Use in combination with Place for location details and Person for attendee information.

## When Not to Use

- Do not use for timeline history -- use TimelineList instead.
- Do not use for tasks or to-do items -- use TaskList instead.
- Do not use for simple date display -- use a plain `<time>` element instead.

## Headless

This component provides an `<article>` element with optional `aria-label` for accessible event identification, with zero visual styling. The consumer is responsible for all CSS including layout, date/time formatting, location styling, and visual hierarchy.

## Styles

The consumer provides all CSS styling. The component renders with an `.event` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders an `<article>` element with class `event`
- Verify `aria-label` is applied when provided
- Verify child content slots are rendered correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Clearly distinguish event date, time, and location from the description. Use consistent formatting across event listings.
- **Developers**: Use semantic `<time>` elements with `datetime` attributes for machine-readable dates. Provide descriptive `label` props for screen readers.
