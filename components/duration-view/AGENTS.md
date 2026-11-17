# DurationView

## Metadata

- Component: duration-view
- PascalCase: DurationView
- Description: a length of time, as an ISO 8601 duration in a `<time>` element, shown in the consumer's words
- Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow
- HTML tag: <time>
- CSS class: .duration-view
- Interactive: no

## Key Behaviors

- Renders `<time class="duration-view" datetime="P3DT4H">` holding the consumer's words
- `duration` is an ISO 8601 duration of days, hours, minutes and seconds, rendered as `datetime`; HTML takes no years, months or weeks (they have no fixed length) and no sign
- A negative duration (`-P3D`, "3 days early") renders its length as `datetime` and adds `data-negative`; the direction is in the consumer's words
- A duration that is not a valid HTML duration renders no `datetime` and raises a development warning
- Writes no words for units: the consumer formats `durationParts()` with `Intl.DurationFormat`, or writes its own

## ARIA

- No role and no `aria-label`; `label` renders as hidden text

## Keyboard

- Not interactive

## Props

- `value`: string (required) — the length of time as the consumer writes it
- `duration`: string (required) — the same length as an ISO 8601 duration of days, hours, minutes and seconds, optionally negative; rendered as `datetime`
- `label`: string (optional) — hidden text naming the value
- `...restProps`: any — additional HTML attributes spread onto the root

## Acceptance Criteria

- [x] Renders <time> with class="duration-view"
- [x] `datetime` holds the duration; a negative one adds `data-negative`
- [x] Years, months and weeks render no `datetime`
- [x] `durationParts()` and `htmlDuration()` are tested in the shared module (and `HtmlDuration` in C#)
- [ ] WCAG 2.2 AAA compliant
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .duration-view in css-style-sheet-template.css
- HTML valid duration string: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#durations
- Intl.DurationFormat: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl/DurationFormat
- openEHR DV_DURATION: https://specifications.openehr.org/releases/RM/latest/data_types.html
- Spec: spec/lessons/openehr/index.md
