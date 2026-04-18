# AvatarText

An avatar circle text is the initials/text fallback within an Avatar. It renders a `<span>` with `aria-hidden="true"` containing initials or short text that represents the user when no image is available.

## Implementation Notes

- Renders a `<span>` element with `aria-hidden="true"`
- `aria-hidden` prevents duplicate screen reader announcements (parent has `aria-label`)
- Content is provided through the children snippet
- Passes through all additional HTML attributes via `...restProps`
- Compound component: must be used inside an Avatar container

## Props

- `children`: Snippet (required) -- initials or short text (e.g., "JD")
- `...restProps`: any -- additional HTML attributes spread onto the `<span>`

## Usage

```svelte
<Avatar alt="Jane Doe">
  <AvatarText>JD</AvatarText>
</Avatar>
```

```svelte
<Avatar alt="Jane Doe">
  <AvatarImage src="/photo.jpg" alt="Jane Doe" />
  <AvatarText>JD</AvatarText>
</Avatar>
```

## Keyboard Interactions

- None -- display-only element

## ARIA

- `aria-hidden="true"` prevents duplicate announcements from parent's `aria-label`

## References

- WAI-ARIA img role: https://www.w3.org/TR/wai-aria-1.2/#img
