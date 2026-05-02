# Person

A person component containing person-related information.

## Props

- `className`: string (optional) -- CSS class appended to `person`
- `label`: string (optional) -- accessible label via `aria-label`
- `children`: ReactNode (required) -- component content
- `...restProps`: unknown -- additional attributes spread onto the `<article>`

## Usage

```tsx
<Person>...</Person>
```

## References

- HTML article element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article
