# Button

A button is a fundamental UI/UX component that allows users to trigger an action
or event within an interface, such as submitting a form, navigating to another
page, or opening a menu. Buttons are essential for guiding users through tasks,
providing clear feedback on actions, and enhancing the overall user experience
by offering intuitive, actionable controls.

**Status:** stable — exercised in composed page flows under e2e and axe, beyond the per-component checks.

This headless component uses the native HTML `<button>` element for inherent
accessibility and keyboard support. It supports toggle button semantics via the
`pressed` prop, accessible label overrides, and all standard button types.

## Implementation Notes

- Uses native `<button>` element for inherent keyboard and accessibility support
- Defaults to `type="button"` (not "submit") to prevent accidental form submissions
- `aria-pressed` only rendered when `pressed` prop is provided (toggle button pattern)
- `aria-label` provides screen reader override when button text alone is insufficient
- Native disabled attribute prevents click events automatically

## Props

- `type`: "button" | "submit" | "reset" (default: "button")
- `disabled`: boolean (default: false)
- `pressed`: boolean | undefined (default: undefined) -- toggle button state
- `label`: string (optional) -- accessible label override
- `onclick`: callback (optional) -- click handler
- `children`: slot -- button content
- `...restProps`: Any additional HTML attributes

## Usage

Submit button for saving progress:

```html
<Button type="submit">Save and continue</Button>
```

Action button that stays unavailable until a form is valid (use `disabled` for this, not for work in progress; see "Pending (async) actions"):

```html
<Button onclick={handleSave} disabled={!formIsValid}>
  Save your progress
</Button>
```

Toggle button with pressed state:

```html
<Button pressed={isBold} onclick={() => isBold = !isBold}>
  Bold
</Button>
```

With accessible label override:

```html
<Button label="Close notification" onclick={handleDismiss}>
  ✕
</Button>
```

## Pending (async) actions

A button that starts work (save, send, pay) is *pending* until the work ends. Do **not** mark it `disabled` while pending: a disabled button leaves the tab order, so keyboard focus is lost when the press happens and when the action finishes, and a screen reader says nothing about what happened. Keep it focusable and say it is busy:

- `aria-busy="true"` while pending, and `aria-disabled="true"` so assistive technology reports it as unavailable. Both reach the `<button>` through the rest props. The button stays enabled and focused.
- Ignore repeat activation in the handler (`if (pending) return;`). `aria-disabled` does not stop the click event; the guard does.
- Show progress in text, not motion alone: change the label (`Saving…`, in the reader's language) or add a `Loading` indicator, and keep the button's width (render the longest label invisibly, or fix the width in CSS) so nothing jumps.
- Announce the outcome once, in a deliberate live region: `role="status"` for success, `role="alert"` for a failure that needs action. Do not put the live region inside the button, whose content changes would be re-read as a new name.
- Clear `aria-busy` and `aria-disabled` in a `finally`, so a failure never leaves the button stuck.

```svelte
<script>
  let pending = $state(false);
  async function save() {
    if (pending) return;
    pending = true;
    try { await saveProgress(); } finally { pending = false; }
  }
</script>

<Button onclick={save} aria-busy={pending} aria-disabled={pending}>
  {pending ? savingLabel : saveLabel}
</Button>
```

The component holds no promise, no timer and no network state; the pending flag is the consumer's. A built-in `status-button` (idle, loading, success, error with its live regions and reserved width) is an open decision: see tasks P13-T9.

## Keyboard Interactions

- Tab: Focus the button
- Enter: Activate the button
- Space: Activate the button
- (All handled natively by `<button>` element)

## ARIA

- Implicit `button` role from `<button>` element
- `aria-pressed` for toggle button state (when provided)
- `aria-label` for screen reader text override
- `aria-disabled` from native disabled attribute

## When to Use

- Use for triggering actions such as form submission, saving progress, opening a dialog, or confirming a choice.
- Use a single primary button per page to give users a clear next step.
- Use when the action changes state or submits data -- buttons signal "do something", not "go somewhere".
- Use the toggle button pattern (with `pressed` prop) for features like bold/italic formatting toggles.
- Use when you need rich content inside the button (icons, formatted text) via children slots.

## When Not to Use

- Do not use for navigation between pages -- use ActionLink or a standard anchor link instead.
- Do not use for linking to external websites -- use a standard anchor link.
- Do not use multiple primary buttons on one page -- use one primary and secondary Button variants.
- Do not use when you need a form-native `<input type="button">` -- use ButtonInput instead.

## Headless

This component provides a native `<button>` element with optional `aria-pressed` for toggle state, `aria-label` override, and standard button types, all with zero visual styling. The consumer is responsible for all CSS including colors, padding, border, border-radius, hover states, focus indicators, disabled appearance, and icon layout.


## Styles

The consumer provides all CSS styling. The component renders with a `.button` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<button>` element with class `button`
- Verify aria-label` for screen reader text override
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Maintain a minimum 44x44px touch target. Use visual hierarchy (primary, secondary, ghost) to distinguish button importance. Ensure disabled buttons have sufficient contrast.
- **Developers**: The default type is `"button"` (not `"submit"`) to prevent accidental form submissions. Only provide the `pressed` prop when implementing a toggle button pattern.

## Related components

- `button-group` — a wrapper that groups related buttons together
- `button-input` — an input element of type button for form actions <input type="button">
- `icon-button` — a button containing only an icon with a required accessible label
- `split-button` — a button with a primary action and a dropdown for related actions
- `toggle-button` — a button that toggles between pressed and unpressed states
- `float-button` — a floating action button anchored to a viewport corner

## References

- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/

---

Lily™ and Lily Design System™ are trademarks.
