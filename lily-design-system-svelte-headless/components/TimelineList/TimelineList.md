# TimelineList

A timeline list is a UI/UX component used to visually organize and display
events, steps, or data points in chronological order, helping users understand
progression over time. Commonly used in project tracking, activity feeds,
historical overviews, or user journeys, timelines can be vertical, horizontal,
or interactive, often incorporating icons, dates, and brief descriptions for
clarity. This component aids comprehension by making complex sequences more
intuitive and scannable. Effective timeline design emphasizes readability,
logical flow, and visual hierarchy, allowing users to quickly grasp the order,
timing, and significance of events or stages.

This component renders as a semantic ordered list (`<ol>`) with an accessible
label, conveying the chronological nature of the content to both sighted users
and screen reader users. The consumer provides TimelineListItem children to
define individual timeline entries.

## Implementation Notes

- Renders as `<ol aria-label={label}>` for chronological event sequences
- Ordered list conveys the chronological nature of events
- All timeline content provided through TimelineListItem children
- Compound component: pair with TimelineListItem for each event entry
- No hardcoded strings; all text content comes through props and children

## Props

- `label`: string (required) -- accessible label via aria-label
- `children`: Snippet -- TimelineListItem elements
- `...restProps`: Any additional HTML attributes spread onto the `<ol>`

## Usage

```svelte
<TimelineList label="Project milestones">
  <TimelineListItem datetime="2024-01" heading="Jan 2024">Project kickoff</TimelineListItem>
  <TimelineListItem datetime="2024-03" heading="Mar 2024">Alpha release</TimelineListItem>
  <TimelineListItem datetime="2024-06" heading="Jun 2024">Beta release</TimelineListItem>
  <TimelineListItem datetime="2024-09" heading="Sep 2024">General availability</TimelineListItem>
</TimelineList>
```

With semantic `<time>` elements:

```svelte
<TimelineList label="Order history">
  <TimelineListItem datetime="2024-01-15" heading="January 15, 2024">
    Order placed
  </TimelineListItem>
  <TimelineListItem datetime="2024-01-16" heading="January 16, 2024">
    Order shipped
  </TimelineListItem>
  <TimelineListItem datetime="2024-01-19" heading="January 19, 2024">
    Order delivered
  </TimelineListItem>
</TimelineList>
```

## Keyboard Interactions

- None directly -- standard list navigation by screen readers
- Tab moves focus between any interactive elements (links, buttons) within timeline items

## ARIA

- Semantic `<ol>` for ordered/chronological content
- `aria-label` provides accessible name for the list
- TimelineListItem uses `<time>` elements with `datetime` attributes for machine-readable dates

## References

- HTML `<time>` element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time
- WAI-ARIA list role: https://www.w3.org/TR/wai-aria-1.2/#list
