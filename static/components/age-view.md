# Age View

AgeView is a headless read-only display of a person's age, in the consumer's words. It renders as a `<span>`. The TypeScript libraries export `ageParts()`, which gives the age in units suited to it (minutes for a newborn, weeks and days for an infant, years and months for a child, years for an adult), and `toIsoDuration()`.

**Status:** experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow.

## Implementation Notes

- Renders `<span class="age-view">` with the consumer's words
- `duration` is the same age as an ISO 8601 duration, rendered as `data-duration`
- Writes no words for units: the consumer formats `ageParts()` with `Intl.DurationFormat` or its own labels

## Props

- `value`: string (required) — the age as the consumer writes it
- `duration`: string (optional) — the same age as an ISO 8601 duration, rendered as `data-duration`
- `label`: string (optional) — hidden text naming the value
- `...restProps`: any — additional HTML attributes spread onto the root

## Usage

```html
<AgeView
  label="Age"
  value="3 weeks 2 days"
  duration="P23D"
/>
```

## Keyboard Interactions

None. This is not an interactive component.

## ARIA

- No role and no `aria-label`; `label` renders as hidden text

## When to Use

- Use beside a date of birth in a patient banner.
- Use where an infant's age in weeks or a child's in years and months matters clinically.

## When Not to Use

- Do not use for a date — use `date-time-view`.
- Do not use for a duration that is not an age — use plain text or `<time>`.

## Headless

This headless component ships zero CSS and decides nothing visual. The consumer provides all styling targeting the `.age-view` class hook, and every word.

## Styles

`.age-view` and `[data-duration]`.

## Testing

- The words and `data-duration` render
- `ageParts()` returns the right units at every band boundary (shared tests)

## Advice

- The unit bands follow the NHS Common User Interface; another convention can ignore `ageParts()` and pass its own words.
- Show the age beside the date of birth, not instead of it.

## Related components

- `date-time-view` — a read-only display of a date and time
- `medical-banner` — a prominent message bar with medical information

## References

- Intl.DurationFormat: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl/DurationFormat
- Spec: spec/healthcare-ui/index.md

---

Lily™ and Lily Design System™ are trademarks.
