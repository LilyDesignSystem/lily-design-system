# TimerButton

A button with a timer that will automatically click after a given amount of time.

## Canonical documentation

See [components/timer-button/index.md](../../../components/timer-button/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/timer-button/macro.njk" import timerButton %}

{{ timerButton({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
