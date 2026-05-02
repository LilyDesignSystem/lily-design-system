# TimerButton

A button that auto-activates after a configurable countdown. The user can click it at any time to act immediately, or let the countdown reach zero to trigger the same action automatically. Useful for "auto-confirm in 5 seconds" or "session continuing in 30 seconds" flows.

## Props

- `label`: string (required) -- accessible label describing the action
- `duration`: number (required) -- countdown duration in seconds
- `disabled`: boolean (default false) -- when true, the timer does not start and the button does not respond to clicks
- default slot — button content

The remaining seconds are exposed on the rendered button as `data-remaining-seconds` so consumer CSS or external observers can react to the countdown.

## Emits

- `click` — fired once when the button activates, manually or via timer

## Usage

```vue
<TimerButton
  label="Continue automatically in 10 seconds"
  :duration="10"
  @click="handleContinue"
>
  Continue
</TimerButton>
```

## References

- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
