# Early Warning Score View

EarlyWarningScoreView is a headless read-only display of an early warning score: the scoring system's name, the score, its band and the escalation it calls for. It renders as a `<span>`. It is display only and computes nothing.

**Status:** experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow.

## Implementation Notes

- Renders `<span class="early-warning-score-view">` with parts `-system`, `-score`, `-band` and `-escalation`
- `band` is the consumer's key, rendered as `data-band`; `bandLabel` is its words and is required with it (a development warning says so)
- Computes nothing: scoring systems differ by country and population, and scoring is the consumer's validated code

## Props

- `score`: string | number (required) — the score the consumer computed
- `system`: string (optional) — the scoring system's name, such as NEWS2
- `band`: string (optional) — the consumer's band key, rendered as `data-band`
- `bandLabel`: string (optional) — the band in words; required with `band`
- `escalation`: string (optional) — what to do
- `label`: string (optional) — hidden text naming the value
- `...restProps`: any — additional HTML attributes spread onto the root

## Usage

```html
<EarlyWarningScoreView
  system="NEWS2"
  score="{7}"
  band="high"
  bandLabel="High"
  escalation="Urgent response"
/>
```

## Keyboard Interactions

None. This is not an interactive component.

## ARIA

- No role and no `aria-label`; `label` renders as hidden text. The band is text, never colour alone

## When to Use

- Use to show an early warning score your own validated code computed.
- Use on an observations chart, a ward board or a handover summary.

## When Not to Use

- Do not expect it to compute a score — it never will.
- Do not use for a laboratory result — use `observation-view`.
- Do not use for a general gauge — use `gauge-chart`.

## Headless

This headless component ships zero CSS and decides nothing visual. The consumer provides all styling targeting the `.early-warning-score-view` class hook, and every word.

## Styles

`.early-warning-score-view` and its parts, and `[data-band]`.

## Testing

- Each part renders, and `band` renders as `data-band`
- A band with no words raises a development warning
- It contains no scoring code (review)

## Advice

- Name the scoring system, since bands and escalation differ between them.
- NEWS2 is not for under-16s or pregnancy; use the score your population needs.

## Related components

- `observation-view` — a clinical observation or result
- `gauge-chart` — a dial chart showing one value within a range

## References

- Spec: spec/healthcare-ui/index.md
- Adopter guide: https://github.com/LilyDesignSystem/lily-design-system/blob/main/docs/patterns/healthcare.md

---

Lily™ and Lily Design System™ are trademarks.
