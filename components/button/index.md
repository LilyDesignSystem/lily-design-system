# Button

A button is a fundamental UI/UX component that allows users to trigger an action
or event within an interface, such as submitting a form, navigating to another
page, or opening a menu. Buttons are essential for guiding users through tasks,
providing clear feedback on actions, and enhancing the overall user experience
by offering intuitive, actionable controls.

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

Action button with disabled state:

```html
<Button onclick={handleSave} disabled={isSaving}>
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

## References

- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/button/
