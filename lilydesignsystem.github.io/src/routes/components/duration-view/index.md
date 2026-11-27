# Duration View

DurationView is a headless read-only display of a length of time, in the consumer's words. It renders as a `<time>` element whose `datetime` is the ISO 8601 duration, so the length stays machine-readable while the reader sees words in their language. The TypeScript libraries export `durationParts()`, whose result `Intl.DurationFormat` turns into words, and `htmlDuration()`.

**Status:** experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow.

## Implementation Notes

- Renders `<time class="duration-view" datetime="P3DT4H">` with the consumer's words
- `duration` takes days, hours, minutes and seconds (`P3DT4H`, `PT90M`): an HTML `datetime` takes no years, months or weeks, which have no fixed length, and no sign
- A negative duration (`-P3D`) renders its length as `datetime` and adds `data-negative`; say the direction in the words ("3 days early")
- A `duration` HTML cannot take renders no `datetime` and raises a development warning
- Writes no words for units: format `durationParts()` with `Intl.DurationFormat`, or pass your own words

## Props

- `value`: string (required) — the length of time as the consumer writes it
- `duration`: string (required) — the same length as an ISO 8601 duration of days, hours, minutes and seconds, optionally negative; rendered as `datetime`
- `label`: string (optional) — hidden text naming the value
- `...restProps`: any — additional HTML attributes spread onto the root

## Usage

```html
<DurationView
  label="Length of stay"
  value="3 days 4 hours"
  duration="P3DT4H"
/>
```

## Keyboard Interactions

None. This is not an interactive component.

## ARIA

- No role and no `aria-label`; `label` renders as hidden text

## When to Use

- Use for a length of time: a length of stay, a wait, an infusion's run time, the time since a dose.
- Use where software or a script needs the length as well as the reader: the `datetime` holds it exactly.
- Use for a negative duration such as "3 days early", with the direction in the words.

## When Not to Use

- Do not use for a person's age — use `age-view`, whose units suit the age.
- Do not use for a date or a time of day — use `date-time-view`.
- Do not use for a length in years or months — they have no fixed length and are no `datetime`; use `age-view` or plain text.
- Do not use for a countdown that changes every second — use `timer`.

## Headless

This headless component ships zero CSS and decides nothing visual. The consumer provides all styling targeting the `.duration-view` class hook, and every word.

## Styles

`.duration-view` and `[data-negative]`.

## Testing

- `datetime` holds the duration and the words render
- A negative duration has `data-negative` and its length as `datetime`
- Years, months and weeks render no `datetime`
- `durationParts()` and `htmlDuration()` are tested in the shared module

## Advice

- Write the words in the reader's language with `Intl.DurationFormat`. It takes whole numbers only, so split fractional seconds into
  milliseconds, and it takes no sign, so say the direction yourself (P55-T6a; `shared/duration-recipe.test.ts` runs this as written):

  ```ts
  function durationWords(iso: string, locale: string) {
    const { negative, seconds, ...rest } = durationParts(iso); // "PT1.5S" and "PT1,5S" both give seconds 1.5
    const whole = Math.trunc(seconds);
    const milliseconds = Math.round((seconds - whole) * 1000);
    const words = new Intl.DurationFormat(locale, { style: "long" }).format({
      ...rest,
      seconds: whole,
      milliseconds,
    });
    return { negative, words }; // put the direction in your own words: "3 days early", "90 minutes ago"
  }
  ```

- Keep the units the record has: 90 minutes is not 1.5 hours, and Lily converts nothing.
- Do not round a clinical duration for display without saying so.

## Related components

- `age-view` — a person's age, in the units suited to it
- `date-time-view` — a read-only display of a date and time
- `timer` — a time that changes as the reader watches

## Known limitations

None known.

## References

- HTML valid duration string: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#durations
- Intl.DurationFormat: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl/DurationFormat
- openEHR DV_DURATION: https://specifications.openehr.org/releases/RM/latest/data_types.html
- Spec: spec/lessons/openehr/index.md

---

Lily™ and Lily Design System™ are trademarks.
