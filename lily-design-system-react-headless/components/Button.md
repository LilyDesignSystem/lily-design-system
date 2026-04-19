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
- `onClick`: callback (optional) -- click handler
- `children`: ReactNode -- button content
- `...restProps`: Any additional HTML attributes

## Usage

Basic action button:

```tsx

  import Button from './Button';

  function handleClick() {
    console.log("clicked");
  }


<Button onClick={handleClick}>Click me</Button>
```

Submit button in a form:

```tsx

  import Button from './Button';

const [isSubmitting, setIsSubmitting] = useState(false);

<form>
  <Button type="submit" disabled={isSubmitting}>Submit</Button>
</form>
```

Toggle button with pressed state:

```tsx
import Button from './Button';

const [isBold, setIsBold] = useState(false);

<Button pressed={isBold} onClick={() => setIsBold(!isBold)}>Bold</Button>
```

With accessible label override:

```tsx
<Button label="Close dialog" onClick={handleClose}>X</Button>
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

## References

- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
