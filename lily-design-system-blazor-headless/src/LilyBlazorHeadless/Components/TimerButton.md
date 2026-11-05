# TimerButton

A button with a timer that will automatically click after a given amount of time.

See `components/timer-button/index.md` for canonical documentation.

The action runs once: when the countdown ends, or when the button is pressed first. `data-remaining-seconds` carries the countdown. Under static rendering nothing counts down.

## Parameters

- `Label`: string (required)
- `Duration`: int (required) — seconds
- `Disabled`: bool — no countdown and no click
- `OnClick`: EventCallback — the action, once
- `ChildContent`, `CssClass`, `AdditionalAttributes`

## Usage

```razor
<TimerButton Label="Continue" Duration="30" OnClick="Continue">Continue</TimerButton>
```
