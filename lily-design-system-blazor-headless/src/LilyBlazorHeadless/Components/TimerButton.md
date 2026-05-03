# TimerButton

A button with a timer that will automatically click after a given amount of time.

See `components/timer-button/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `timer-button`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<TimerButton Label="...">
    Content
</TimerButton>
```
