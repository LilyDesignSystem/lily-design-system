# TimerButton

a button with a timer that will automatically click after a given amount of time

This is the Angular headless implementation. See `components/timer-button/index.md`
in the canonical repo root for the cross-framework documentation.

The action runs once, through `fired`: when the countdown ends, or when the button is pressed first.

## Selector

```html
<lily-timer-button
  label="Continue"
  [duration]="30"
  (fired)="continue()"
  >Continue</lily-timer-button
>
```

## Files

- `TimerButton.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `TimerButton.spec.ts` — vitest + TestBed render test
