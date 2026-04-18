# AvatarImage

An avatar circle image is the profile photo element within an Avatar. It renders a native `<img>` element with `aria-hidden="true"` to prevent duplicate announcements (since the parent Avatar already has `aria-label`).

## Implementation Notes

- Renders a native `<img>` element
- `aria-hidden="true"` prevents duplicate screen reader announcements
- Passes through all additional HTML attributes via `...restProps`
- Compound component: must be used inside an Avatar container

## Props

- `src`: string (required) -- URL of the avatar image
- `alt`: string (required) -- accessible description for the image
- `...restProps`: any -- additional HTML attributes spread onto the `<img>`

## Usage

```svelte
<Avatar alt="Jane Doe">
  <AvatarImage src="/photos/jane.jpg" alt="Jane Doe" />
</Avatar>
```

## Keyboard Interactions

- None -- display-only element

## ARIA

- `aria-hidden="true"` prevents duplicate announcements from parent's `aria-label`
- Native `<img>` with `alt` text for image fallback contexts

## References

- HTML img element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img
