# EmailInput

An email input wraps a native `<input type="email">` with accessible labeling. Provides a streamlined API for basic email collection with required and disabled state support.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | string | required | Accessible name via aria-label |
| value | string | "" | Current email value (bindable) |
| required | boolean | false | Whether the field is required |
| disabled | boolean | false | Whether the field is disabled |
| ...restProps | HTML attributes | — | Spread onto the `<input>` |

## Usage

```svelte
<EmailInput label="Your email" bind:value />
```

```svelte
<EmailInput label="Contact email" bind:value required />
```

## Keyboard

- Native browser email input keyboard behavior

## Accessibility

- `aria-label` provides an accessible name for the email input

## References

- [MDN input type="email"](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email)
