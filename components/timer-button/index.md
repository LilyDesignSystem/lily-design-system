# TimerButton

A timer button is a button with a countdown timer that will automatically activate after a given amount of time. It is used for auto-advancing workflows, timed confirmations, or undo-with-timeout patterns.

This headless component uses a `<button>` element with a visible countdown timer, providing both manual click activation and automatic timer-based activation.

## Implementation Notes

- Uses `<button>` element for semantic button behavior
- Countdown timer shown via `aria-live="polite"` region
- `aria-label` includes remaining time for screen readers
- Auto-activates when countdown reaches zero
- User can click to activate immediately before timer expires
- Timer can be cancelled by disabling or unmounting the component

## Props

- `duration`: number (required) -- countdown duration in seconds
- `label`: string (required) -- accessible label describing the action
- `disabled`: boolean (default: false) -- whether the button is disabled
- `onclick`: callback (optional) -- handler called when activated (manually or by timer)
- `children`: slot -- button content
- `...restProps`: Any additional HTML attributes

## Usage

```html
<TimerButton duration={10} label="Undo delete" onclick={handleUndo}>
  Undo deletion (10s remaining)
</TimerButton>
```

```html
<TimerButton duration={5} label="Auto-advance to next step" onclick={handleNext}>
  Continuing to next step in 5s...
</TimerButton>
```

```html
<TimerButton duration={15} label="Auto-submit form" onclick={handleSubmit}>
  Form will submit automatically in 15s
</TimerButton>
```

## Keyboard Interactions

- Tab: Focus the button
- Enter: Activate the button immediately
- Space: Activate the button immediately
- Escape: Cancel the timer (optional behavior)

## ARIA

- Implicit `button` role from `<button>` element
- `aria-label` -- describes the action and remaining time
- `aria-live="polite"` region for countdown announcements

## When to Use

- Use for a button that automatically triggers after a countdown, such as auto-redirect or auto-submit after review.
- Use for undo-with-timeout patterns where an action auto-confirms after a delay.
- Use for auto-advancing wizards or slideshow controls.
- Use when users should have the option to click immediately or wait for the timer.

## When Not to Use

- Do not use for countdown display only -- use Timer instead.
- Do not use for immediate actions without a delay -- use Button instead.
- Do not use for critical destructive actions without an undo mechanism -- use SliderButton or AlertDialog instead.

## Headless

This component provides a `<button>` element with countdown timer logic and ARIA live region for accessible time announcements, with zero visual styling. The consumer is responsible for all CSS including countdown display, progress indicator, timer animation, and button appearance.

## Styles

The consumer provides all CSS styling. The component renders with a `.timer-button` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<button>` element with class `timer-button`
- Verify `aria-label` is applied
- Verify countdown timer activates the button at zero
- Verify manual click activates the button immediately
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Show a visual countdown (progress bar, seconds display) so users know how much time remains. Provide a way to cancel or extend the timer.
- **Developers**: Update `aria-label` with remaining time for screen reader users. Clean up timer intervals when the component unmounts or is cancelled.
